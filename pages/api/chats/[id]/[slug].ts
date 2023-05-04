import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
  } = req;
  const chats = await client.chatRoom.findMany({
    where: {
        purchaserId:user?.id
    },
    include: {
      purchaser: true,
      seller: true,
    },
  });

  res.json({
    ok: true,
    chats,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
