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

  const alreadyExists = await client.like.findFirst({
    where: {
      userId: user?.id,
      storyId: Number(id),
    },
    select: {
      id: true,
    },
  });

  if (alreadyExists) {
    await client.like.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    await client.like.create({
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
      },
    });
  }

  await res.revalidate('/story');

  res.json({
    ok: true,
  });
}



export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
