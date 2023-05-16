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
  } = req;
  const chatRoom = await client.chatRoom.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      purchaser: true,
      seller: true,
      product: {
        select: {
          name: true,
          price:true,
          image:true,
          sellState:true,
        },
      },
      messages: true,
    },
  });

  res.json({
    ok: true,
    chatRoom,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
