import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import products from "../products";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const chats = await client.chatRoom.findMany({
      where: {
        
      },
    });
    res.json({
      ok: true,
      chats,
    });
  }

  if (req.method === "POST") {
    const {
      body: { content },
      session: { user },
    } = req;

   


    res.json({
      ok: true,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
