import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      query: { page },
    } = req;
    const PAGE = Number(page) - 1;
    const TAKE = 8;
    const SKIP = PAGE * 8;

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
      pages: Math.ceil(productsCount / 10),
    });
  }
  if (req.method === "POST") {
    const {
      body: { name, price, description, photoId, productId },
      session: { user },
    } = req;

    // modify
    if (productId) {
      const updateProduct = await client.product.update({
        where: {
          id: productId,
        },
        data: {
          name,
          price: +price.replaceAll(",", ""),
          description,
          image: photoId ? photoId : "",

          seller: {
            connect: {
              id: user?.id,
            },
          },
        },
      });

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

          seller: {
            connect: {
              id: user?.id,
            },
          },
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
    res.revalidate("/");
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
