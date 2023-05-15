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
    query : {id},
    body,
  } = req;

  if (req.method === "POST") {
    const message = await client.message.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        ChatRoom: {
          connect: {
            id: Number(id),
          },
        },
        
        message: body.message,
      },
    });
    res.json({
      ok: true,
      message,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
