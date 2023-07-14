import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { Kind } from "@prisma/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      session: { user },
      query: { kind },
    } = req;
    console.log(kind);
    const records = await client.record.findMany({
      where: {
        userId: user?.id,
        kind: kind as Kind,
      },
      include: {
        product: {
          include: {
            _count: {
              select: {
                records: {
                  where: {
                    kind: {
                      equals: "Favorite"
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

  if (req.method === "POST") {
    const {
      session: { user },
      query: { kind },
    } = req;

    const isExistRecord = Boolean(
      await client.record.findFirst({
        where: {},
      })
    );
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
    isPrivate: true,
  })
);
