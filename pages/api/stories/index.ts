import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";


const TAKE_COUNT = 8;

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      query: { page },
    } = req;
    const PAGE = Number(page) - 1;
    const TAKE = TAKE_COUNT;
    const SKIP = PAGE * TAKE_COUNT;

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
      orderBy: {
        updatedAt: "desc",
      },
      take: TAKE,
      skip: SKIP,
    });

    const storiesCount = await client.story.count();

    res.json({
      ok: true,
      stories,
      pages: Math.ceil(storiesCount / TAKE_COUNT),
    });
  }

  if (req.method === "POST") {
    const {
      body: { content, category },
      session: { user },
    } = req;

    const story = await client.story.create({
      data: {
        content,
        category,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    await res.revalidate("/story");

    const storiesCount = await client.story.count();

    res.json({
      ok: true,
      story,
      pages: Math.ceil(storiesCount / TAKE_COUNT),
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
