import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    body: { reportNum, reportedUrl },
  } = req;

  if (req.method === "POST") {
    const report = await client.report.create({
      data:{
        reportedUrl : String(reportedUrl),
        reportedUserId: user?.id || 0,
        reportNum : Number(reportNum)
      }
    })

    res.json({
      ok: true,
      report,
    });
  }

  if (req.method === "GET") {
    const report = await client.report.findMany({});

    res.json({
      ok: true,
      report,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
