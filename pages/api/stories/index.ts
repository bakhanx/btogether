import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const stories = await client.story.findMany({
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy:{
        updatedAt:"desc"
      }
    });
    res.json({
      ok: true,
      stories,
    });
  }

  if (req.method === "POST") {
    const {
      body: { content },
      session: { user },
    } = req;

    const story = await client.story.create({
      data: {
        content,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    let revalidated = false
    try{
      await res.revalidate("/community");
      revalidated = true;  
      res.json({ok:true, revalidate:true})
    } catch(err){
      console.error(err);
      res.status(500)
    }

    

    res.json({
      ok: true,
      story,
      
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
