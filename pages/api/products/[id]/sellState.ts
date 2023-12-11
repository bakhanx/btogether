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

  const isExistState = Boolean(
    await client.product.findFirst({
      where: {
        id: Number(id),
      },
      select: {
        records: {
          where: {
            kind: "Purchase",
          },
        },
      },
    })
  );

  if (sellState === "selling") {
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
        },
      },
    });
  } else if (sellState === "reserve") {
    if (isExistState) {
      await client.product.update({
        where: { id: Number(id) },
        data: {
          purchaser: {
            disconnect: true,
          },
          records: {
            deleteMany: { kind: "Purchase" },
          },
        },
      });
    }

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
    if (isExistState) {
      await client.product.update({
        where: { id: Number(id) },
        data: {
          purchaser: {
            disconnect: true,
          },
          records: {
            deleteMany: { kind: "Purchase" },
          },
        },
      });
    }

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

  await res.revalidate('/');
  await res.revalidate(`/product/${id}`)
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
