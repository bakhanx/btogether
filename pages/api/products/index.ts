import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const products = await client.product.findMany({
      include: {
        _count: {
          select: {
            records: true,
          },
        },
      },
      take: 8,
      orderBy: {
        updatedAt: "desc",
      },
    });
    res.json({
      ok: true,
      products,
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
      res.json({
        ok: true,
        product,
      });
    }
    // res.revalidate(`/`);
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
