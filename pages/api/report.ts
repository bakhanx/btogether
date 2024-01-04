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
    body: { reportNum, reportedUrl, reportedUserId, content, reportType },
  } = req;

  if (req.method === "POST") {
    const report = await client.report.create({
      data: {
        reportedUrl: String(reportedUrl),
        reportUserId: user?.id || 0,
        reportedUserId: reportedUserId || 0,
        reportNum: Number(reportNum),
        content,
        reportType,
      },
    });

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
