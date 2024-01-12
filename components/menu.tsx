import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type MenuType = "Product" | "Story" | "Comment";

export default function Menu(props: {
  type: MenuType;
  writerId: number;
  content: string;
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onModify?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  // onReport? : (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const [isOnMenu, setisOnMenu] = useState(false);
  const [reportMutate, { data, loading }] = useMutation("/api/report");
  const { register, reset, handleSubmit: reportHandleSubmit } = useForm<any>();
  const router = useRouter();

  const [isOnReport, setIsOnReport] = useState(false);
  const [reportNum, setReportNum] = useState(0);
  const { user } = useUser();

  const onReportValid = () => {
    if (confirm("신고하시겠습니까?")) {
      console.log(reportNum);
      console.log(router.asPath);
      reportMutate({
        reportedUrl: router.asPath,
        reportedUserId: props.writerId,
        reportNum,
        content: props.content,
        reportType: props.type,
      });
    }

    // if (!loading) {
    //
    //   setIsOnReport(false);
    // }
    // router.reload();
  };

  useEffect(() => {
    if (data && data.ok) {
      console.log(data);
      alert("신고가 완료되었습니다.");
      setIsOnReport(false);
    }
  }, [data, router]);

  // const onDelete = (event: any) => {
  //   event.preventDefault();
  // };

  const handleClickMenu = () => {
    setisOnMenu(!isOnMenu);
  };
  const handleLeaveFocusOut = () => {
    setTimeout(() => {
      setisOnMenu(false);
    }, 100);
  };

  const handleClickReoprt = () => {
    setIsOnReport(!isOnReport);
  };

  const handleSetReportNum = (
    num: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    console.log(num);
    setReportNum(num);
  };

  return (
    <>
      {isOnReport ? (
        <>
          <div className="fixed left-0 top-0  w-screen h-full bg-black bg-opacity-60 z-10" />
          <div className="flex justify-center">
            <div className=" fixed z-50 w-3/4 max-w-xl m-auto inset-0 h-96 bg-white bg-opacity-90 text-black border-purple-200 border rounded-md text-base">
              <div className="flex p-3 border-b-2">
                <div className="items-center justify-center w-full text-center">
                  신고하기
                </div>
                <button onClick={handleClickReoprt} className="pr-3">
                  X
                </button>
              </div>

              <div className="border-b-2 p-2">
                <div className="flex">
                  <div className="text-gray-600 w-14">작성자</div>
                  <span>:</span>
                  <div className="ml-2">asd***</div>
                </div>
              </div>

              <form onSubmit={reportHandleSubmit(onReportValid)}>
                <div className="flex flex-col items-center">
                  <div className="flex flex-row w-full justify-around p-5">
                    <div className="flex flex-col gap-y-4">
                      {[
                        "욕설/비하",
                        "영리/홍보",
                        "반복(도배)",
                        "개인정보노출",
                      ].map((cate, i) => (
                        <>
                          <button
                            onClick={(e) => handleSetReportNum(i, e)}
                            className="hover:text-red-700 focus:text-red-700"
                          >
                            {cate}
                          </button>
                        </>
                      ))}
                    </div>
                    <div className="flex flex-col gap-y-4">
                      {["음란/선정", "사기/불법", "사재기", "기타"].map(
                        (cate, i) => (
                          <>
                            <button
                              onClick={(e) => handleSetReportNum(i + 4, e)}
                              className="hover:text-red-700 focus:text-red-700"
                            >
                              {cate}
                            </button>
                          </>
                        )
                      )}
                    </div>
                  </div>
                  <div className="w-full items-center flex">
                    <button className="w-full p-3 m-2 bg-red-500 text-white hover:bg-red-600">
                      신고하기
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        ""
      )}

      <div className="relative right-1">
        <button
          onClick={handleClickMenu}
          type="button"
          onBlur={handleLeaveFocusOut}
          aria-label="메뉴"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
            />
          </svg>
        </button>

        {isOnMenu ? (
          <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {props.writerId === user?.id ? (
              // 작성자 UI
              <div className="py-1">
                {props.type !== "Comment" && (
                  <button
                    onClick={props.onModify}
                    className="block w-full py-2 pr-10 text-sm text-gray-700 hover:bg-slate-100"
                  >
                    수정하기
                  </button>
                )}
                <button
                  onClick={props.onDelete}
                  className="block  w-full py-2 pr-10 text-sm text-red-500 hover:bg-slate-100"
                >
                  삭제하기
                </button>
              </div>
            ) : (
              // 뷰어 UI
              <div className="py-1">
                <button
                  onClick={handleClickReoprt}
                  className="block w-full py-2 pr-10 text-sm text-red-500"
                >
                  신고하기
                </button>
              </div>
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
