import useSWR from "swr";

type reportType = {
  reportNum: number;
  reportedUrl: string;
  updatedAt : string;
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
  const { data: reportData, isLoading } = useSWR<reportType[]>(`api/report`);

  return (
    <>
      <div className="p-2">관리자 페이지</div>
      {reportData?.map((data) => {
        return (
          <>
            <div className="p-2">
              <div>신고내용 : {REPORT_CATE[data?.reportNum]}</div>
              <div>신고경로 : {data?.reportedUrl}</div>
              <div>신고날짜 : {data?.updatedAt}</div>
            </div>
          </>
        );
      })}
    </>
  );
};

export default Admin;
