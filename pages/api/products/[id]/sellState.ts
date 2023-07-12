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
    body: { sellState },
  } = req;

  console.log(sellState);
  await client.product.update({
    where: {
      id: Number(id),
    },
    data: {
      sellState: sellState,
    },
  });

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
