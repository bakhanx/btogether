import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const TAKE_COUNT = 8;

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      query: { page },
    } = req;
    const PAGE = Number(page) - 1;
    const TAKE = TAKE_COUNT;
    const SKIP = PAGE * TAKE_COUNT;

    const products = await client.product.findMany({
      include: {
        _count: {
          select: {
            records: {
              where: {
                kind: {
                  equals: "Favorite",
                },
              },
            },
            chatRooms: true,
          },
        },
      },
      take: TAKE,
      skip: SKIP,
      orderBy: {
        updatedAt: "desc",
      },
    });

    const productsCount = await client.product.count();

    res.json({
      ok: true,
      products,
      pages: Math.ceil(productsCount / TAKE_COUNT),
    });
  }
  if (req.method === "POST") {
    const {
      body: { name, price, description, photoId, productId, category },
      session: { user },
    } = req;

    // modify
    if (productId) {
      const updateProduct = await client.product.update({
        where: {
          id: Number(productId),
        },
        data: {
          name,
          price: +price.replaceAll(",", ""),
          description,
          image: photoId && Number(photoId),
          seller: {
            connect: {
              id: user?.id,
            },
          },
          category,
          isModify: true,
        },
      });

      await res.revalidate("/");
      await res.revalidate(`/product/${productId}`);

      res.json({
        ok: true,
        updateProduct,
      });
    }

    // create
    else {
      const product = await client.product.create({
        data: {
          name,
          price: +price.replaceAll(",", ""),
          description,
          image: photoId ? photoId : "",
          // category,
          seller: {
            connect: {
              id: user?.id,
            },
          },
          category,
        },
      });

      const record = await client.record.create({
        data: {
          user: {
            connect: {
              id: user?.id,
            },
          },
          product: {
            connect: {
              id: product?.id,
            },
          },
          kind: "Sale",
        },
      });

      res.json({
        ok: true,
        product,
        record,
      });
    }
    await res.revalidate("/");
    await res.revalidate(`/product/${productId}`);
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
