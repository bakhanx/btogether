import useSWR from "swr";

type reportType = {
  reportNum: number;
  reportedUrl: string;
};

const Admin = () => {
  const { data: reportData, isLoading } = useSWR<reportType[]>(`api/report`);

  return (
    <>
      {reportData?.map((data) => {
        return (
          <>
            <div>신고번호 : {data?.reportNum}</div>
            <div>신고경로 : {data?.reportedUrl}</div>
          </>
        );
      })}
    </>
  );
};

export default Admin;
