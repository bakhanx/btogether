import Button from "./button";

export default function Report() {
  return (
    <>
      <div className="relative flex justify-center w-full">
        <div className="center fixed top-48 z-50  h-96 w-2/3 max-w-xl 릳ㅌ  bg-slate-50 opacity-90 text-black border-purple-200 border rounded-md">
          <div className="flex p-3 border-b-2">
            <div className="items-center justify-center w-full text-center">
              신고하기
            </div>
            <div className="pr-3">X</div>
          </div>

          <div className="border-b-2 p-2">
            <div className="flex">
              <div className="text-gray-600 w-14">작성자</div>
              <span>:</span>
              <div className="ml-2">asd***</div>
            </div>
          </div>

          <div className="flex flex-row w-full justify-around p-10">
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

          <button className="w-full bg-red-500 text-white p-2 hover:bg-red-600">
            신고하기
          </button>
        </div>
      </div>
    </>
  );
}
