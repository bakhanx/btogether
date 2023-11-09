import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { reportNum, reportedUrl},
  } = req;

//   const report = await client?.report.create({
//     data: {
//       reportNum,
//       postQuery,
//     },
//   });

  res.json({
    ok: true,
    reportNum,
    reportedUrl
    // report,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
