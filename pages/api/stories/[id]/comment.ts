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
    session: { user },
    body: { comment },
  } = req;

  const story = client.story.findUnique({
    where:{
        id:Number(id),
    },
    select:{
        id:true
    }            
  })

  if(!story) {
    return res.status(404).end();
  }

  await client.comment.create({
    data: {
      user: {
        connect: {
          id: user?.id,

        },
      },
      story: {
        connect: {
          id: Number(id),
        },
      },
      comment,
    },
  });

  res.json({
    ok: true,
    comment,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
