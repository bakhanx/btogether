import { NextPage } from "next";

const Slogan: NextPage = () => {
  return (
    <div className="px-2 py-4 ">
      <div className="bg-gradient-to-tr from-blue-500 via-sky-500 to-sky-400 text-white p-5 rounded-md space-y-10  shadow-violet-400 shadow-md">
        <div className="text-2xl">이웃과 함께하는 비투게더</div>
        <div>
          <div>공동구매, 중고거래, 친목도모 등</div>
          <div>다양하게 활용해 보세요!</div>
        </div>
      </div>
    </div>
  );
};

export default Slogan;
