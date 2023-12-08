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

      await res.revalidate('/story')

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

      await res.revalidate('/story')

      res.json({
        ok: true,
        deleteComment,
      });
    }


  }

  if (req.method === "GET") {
    const {
      query: { id, page },
    } = req;

    const PAGE = Number(page) - 1;
    const TAKE = 6;
    const SKIP = PAGE * 6;

    const story = await client.story.findFirst({
      where: {
        id: Number(id),
      },
      select: {
        comments: {
          include: { user: true },
          take: TAKE,
          skip: SKIP,
          orderBy:{updatedAt:"desc"}    
        },
      

        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    res.json({
      ok: true,
      story,
      pages: story && Math.ceil(story._count.comments / 10),
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
