import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { Kind } from "@prisma/client";
import { CategoryType } from "@components/myProductList";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      session: { user },
      query: { kind, category },
    } = req;

    if (kind === "Favorite") {
      const records = await client.record.findMany({
        where: {
          userId: user?.id,
          kind: "Favorite",
        },
        include: {
          product: {
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
          },
        },
        orderBy: {
          id: "desc",
        },
      });

      res.json({
        ok: true,
        records,
      });
    } else {
      const records = await client.record.findMany({
        where: {
          userId: user?.id,
          kind: kind as Kind,
          product: {
            category: category as CategoryType,
          },
        },
        include: {
          product: {
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
          },
        },
      });

      res.json({
        ok: true,
        records,
      });
    }
  }

  // if (req.method === "POST") {
  //   const {
  //     session: { user },
  //     query: { kind },
  //   } = req;

  //   const isExistRecord = Boolean(
  //     await client.record.findFirst({
  //       where: {},
  //     })
  //   );
  // }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: true,
  })
);
