import DateTime from "@components/datetime";
import Link from "next/link";
import useSWR from "swr";

type ReportResponse = {
  ok: boolean;
  report: {
    id: number;
    reportNum: number;
    reportedUrl: string;
    updatedAt: Date;
    reportedUserId: number;
  }[];
};

const REPORT_CATE = [
  "욕설/비하",
  "영리/홍보",
  "반복(도배)",
  "개인정보노출",
  "음란/선정",
  "사기/불법",
  "사재기",
  "기타",
];

const Admin = () => {
  const { data: reportData, isLoading } = useSWR<ReportResponse>(`api/report`);

  return (
    <>
      <div className="p-2">관리자 페이지</div>
      {reportData?.report.map((data) => {
        return (
          <>
            <div className="p-2">
              <div className="text-lg font-bold">
                <DateTime date={data?.updatedAt} />
              </div>
              <div className="">
                <div>신고자id : {data?.reportedUserId}</div>
                <div>신고내용 : {REPORT_CATE[data?.reportNum]}</div>
                <div>
                  신고경로 :{" "}
                  <span className="underline text-blue-700">
                    <Link href={`${data?.reportedUrl}`}>
                      {data?.reportedUrl}
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </>
        );
      })}
    </>
  );
};

export default Admin;
