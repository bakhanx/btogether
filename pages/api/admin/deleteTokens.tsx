import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  // time out 5 minute
  const nowTime = new Date();
  nowTime.setMinutes(nowTime.getMinutes() - 5);

  const isOldToken = await client.token.findMany({
    where: {
      createdAt: {
        lte: nowTime,
      },
    },
  });

  if (isOldToken) {
    await client.token.deleteMany({
      where: {
        createdAt: {
          lte: nowTime,
        },
      },
    });
  }

  res.json({
    ok: true,
    isOldToken,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: false,
  })
);
