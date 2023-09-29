export default function Report() {
  return (
    <>
      <div className="relative flex justify-center w-full">
        <div className="center fixed top-48 z-50 flex h-96 w-2/3 max-w-xl items-center justify-center bg-slate-50 opacity-90 text-black border-purple-200 border rounded-md">
          <div className="flex flex-row w-full justify-around">
            <div className="flex flex-col gap-y-4">
              <button className="hover:text-red-700">영리/홍보</button>
              <button className="hover:text-red-700">욕설/비하</button>
              <button className="hover:text-red-700">내용반복(도배)</button>
              <button className="hover:text-red-700">개인정보노출</button>
            </div>
            <div className="flex flex-col gap-y-4">
              <button className="hover:text-red-700">음란/선정</button>
              <button className="hover:text-red-700">사기/불법</button>
              <button className="hover:text-red-700">사재기</button>
              <button className="hover:text-red-700">기타</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
