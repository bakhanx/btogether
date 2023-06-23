import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.session) {
    req.session.destroy();
  }
  
  res.json({
    ok:true,
  })
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
