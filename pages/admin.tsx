import DateTime from "@components/datetime";
import useMutation from "@libs/client/useMutation";
import Link from "next/link";
import useSWR from "swr";

type ReportResponse = {
  ok: boolean;
  report: {
    id: number;
    reportNum: number;
    reportUserId: number;
    reportedUserId: number;
    reportedUrl: string;
    updatedAt: Date;
    content: string;
    reportType: string;
    isCheck: boolean;
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

  const [delMutation, { data, loading }] = useMutation(
    `api/admin/deleteTokens`
  );

  const handleDeleteTokens = () => {
    if (!loading) {
      delMutation({});
    }
  };

  return (
    <>
      <div className="p-2">관리자 페이지</div>

      <div className="pt-10">
        <button
          className="border bg-blue-500 text-white rounded-md p-3 hover:bg-blue-600 "
          onClick={handleDeleteTokens}
        >
          오래된 토큰 제거
        </button>
      </div>

      <div className="text-2xl pt-20">신고 리스트</div>
      {!isLoading && reportData?.report.map((data, index) => {
        return (
          <>
            <div className="p-2" key={index}>
              <div className="text-lg font-bold">
                <DateTime date={data?.updatedAt} />
              </div>
              <div>
                <div>신고한 사람 : {data?.reportUserId}</div>
                <div>신고받은 사람 : {data?.reportedUserId}</div>
                <div>사유 : {REPORT_CATE[data?.reportNum]}</div>
                <div>내용 : {data?.content}</div>
                <div>유형 : {data?.reportType}</div>
                <div>
                  경로 :{" "}
                  <span className="underline text-blue-700">
                    <Link href={`${data?.reportedUrl}`}>
                      {data?.reportedUrl}
                    </Link>
                  </span>
                </div>
                <div>조치 여부 : {data?.isCheck ? "yes" : "no"}</div>
              </div>
            </div>
          </>
        );
      })}
    </>
  );
};

export default Admin;
