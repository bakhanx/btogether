import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;

  const product = await client?.product.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (product?.sellerId === user?.id) {
    const deleteProduct = await client?.product.delete({
      where: {
        id: Number(id),
      },
    });

    await res.revalidate('/');

    res.json({
      ok: true,
      deleteProduct,
    });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
