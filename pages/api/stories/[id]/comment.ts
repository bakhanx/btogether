import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    const {
      query: { id },
      session: { user },
      body: { comment, commentId },
    } = req;

    console.log(req.body);

    const story = client.story.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
      },
    });

    if (!story) {
      return res.status(404).end();
    }

    if (comment) {
      const createComment = await client.comment.create({
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
        createComment,
      });
    }

    if (commentId) {
      const deleteComment = await client.comment.delete({
        where: {
          id: Number(commentId),
        },
      });
      res.json({
        ok: true,
        deleteComment,
      });
    }
  } 
  
  if (req.method === "GET") {
    const {
      query: { id },
    } = req;

    const story = await client.story.findFirst({
      where: {
        id: Number(id),
      },
      select: {
        comments: {
          include: { user: true },
        },
        _count:{
          select: {
            comments:true
          }
        }
      },
    });

    res.json({
      ok: true,
      story,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
