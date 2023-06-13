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
    res.json({
      ok: true,
      deleteProduct,
    });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
