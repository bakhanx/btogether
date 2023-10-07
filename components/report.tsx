import { useState } from "react";
import Button from "./button";
import { useForm } from "react-hook-form";

export default function Report({ userId }: any) {
  const { register, reset, handleSubmit: reportHandleSubmit } = useForm<any>();
  const onReportValid = (validForm: any) => {};
  const [isOnReport, setIsOnReport] = useState(true);

  const handleLeaveFocusOut = () => {
    setTimeout(() => {
      setIsOnReport(false);
    }, 100);
  };

  return (
    <>
      {isOnReport ? (
        <div className="flex justify-center ">
          <div className=" fixed z-50 top-1/2 -translate-y-1/2 w-3/4 max-w-xl bg-white bg-opacity-90 text-black border-purple-200 border rounded-md text-base">
            <div className="flex p-3 border-b-2">
              <div className="items-center justify-center w-full text-center">
                신고하기
              </div>
              <button onClick={handleLeaveFocusOut} className="pr-3">
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
                    <button className="hover:text-red-700 focus:text-red-700">
                      욕설/비하
                    </button>
                    <button className="hover:text-red-700 focus:text-red-700">
                      영리/홍보
                    </button>
                    <button className="hover:text-red-700 focus:text-red-700">
                      내용반복(도배)
                    </button>
                    <button className="hover:text-red-700 focus:text-red-700">
                      개인정보노출
                    </button>
                  </div>
                  <div className="flex flex-col gap-y-4">
                    <button className="hover:text-red-700 focus:text-red-700">
                      음란/선정
                    </button>
                    <button className="hover:text-red-700 focus:text-red-700">
                      사기/불법
                    </button>
                    <button className="hover:text-red-700 focus:text-red-700">
                      사재기
                    </button>
                    <button className="hover:text-red-700 focus:text-red-700">
                      기타
                    </button>
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
      ) : (
        ""
      )}
    </>
  );
}
