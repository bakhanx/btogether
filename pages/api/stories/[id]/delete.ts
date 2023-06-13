import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;

  const story = await client?.story.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (story?.userId === user?.id) {
    const deleteStroy = await client?.story.delete({
      where: {
        id: Number(id),
      },
    });
    res.json({
      ok: true,
      deleteStroy,
    });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
