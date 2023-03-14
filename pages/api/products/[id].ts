import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { id } = req.query;
  const product = await client.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));

  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: Number(id),
        },
      },
      //   ```eqaul AND```
      //   NOT: {
      //     id: Number(product?.id),
      //   },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  res.json({
    ok: true,
    product,
    relatedProducts,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
