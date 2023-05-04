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
    query: { id },
  } = req;
  const chats = await client.chatRoom.findMany({
    where: {
        productId:Number(id),
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
