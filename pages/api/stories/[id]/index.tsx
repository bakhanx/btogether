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
    body: { content },
  } = req;

  if (req.method === "POST") {
    const updateStory = await client.story.update({
      where: {
        id: Number(id),
      },
      data: {
        content,
      },
    });

    await res.revalidate(`/story/${id}`);
    await res.revalidate("/story");
    

    res.json({
      ok: true,
      updateStory,
    });
  }

  if (req.method === "GET") {
    const story = await client.story.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },

        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    const isLike = Boolean(
      await client.like.findFirst({
        where: {
          storyId: Number(id),
          userId: user?.id,
        },
        select: {
          id: true,
        },
      })
    );

    res.json({
      ok: true,
      story,
      isLike,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
