import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    body: { sellState, purchaserId },
  } = req;

  console.log(sellState);
  console.log(purchaserId);

  if (sellState === "selling") {
    const product = await client.product.findFirst({
      where: { id: Number(id) },
      select: { sellerId: true },
    });

    await client.product.update({
      where: {
        id: Number(id),
      },
      data: {
        sellState: sellState,
        purchaser: { disconnect: true },
        records: {
          deleteMany: {
            kind: "Purchase",
          },
          create: {
            kind: "Sale",
            user: {
              connect: {
                id: Number(product?.sellerId),
              },
            },
          },
        },
      },
    });
  } else if (sellState === "reserve") {
    await client.product.update({
      where: {
        id: Number(id),
      },
      data: {
        sellState: sellState,
        purchaser: {
          connect: { id: purchaserId },
          update: {
            Record: {
              create: {
                kind: "Purchase",
                product: {
                  connect: {
                    id: Number(id),
                  },
                },
              },
            },
          },
        },
      },
    });
  } else if (sellState === "sold") {
    await client.product.update({
      where: {
        id: Number(id),
      },
      data: {
        sellState: sellState,
        purchaser: {
          connect: { id: purchaserId },
          update: {
            Record: {
              create: {
                kind: "Purchase",
                product: {
                  connect: {
                    id: Number(id),
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  res.json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
