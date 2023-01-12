import { NextPage } from "next";
import Layout from "../../components/layout";
import TextArea from "../../components/textarea";

const CommunityDetail: NextPage = () => {
  return (
    <Layout canGoBack>
      <div className="pt-2">
        {/* Profile */}
        <span className="ml-4 items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
          이웃소식
        </span>
        <div className="mt-2 mb-3 flex cursor-pointer items-center space-x-3 border-b px-4 pb-3">
          <div className="h-10 w-10 rounded-full bg-slate-300" />
          <div>
            <p className="text-sm font-medium text-gray-700">Steve Jebs</p>
            <p className="text-xs font-medium text-gray-500">
              View profile &rarr;
            </p>
          </div>
        </div>

        <div>
          <div className="mt-2 px-4 text-gray-700">
            <span>공동 구매 후기입니다.</span>
          </div>

          <div className="mt-3 flex w-full justify-start space-x-5 border-t px-4 py-2.5">
            <span className="flex items-center space-x-2 text-sm">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="limegreen"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>추천 1</span>
            </span>

            <span className="flex items-center space-x-2 text-sm">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="orange"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              <span>댓글 2</span>
            </span>
          </div>
        </div>

        {/* 댓글 리스트 */}
        <div className="my-5 space-y-5 px-4">
          <div className="flex items-start space-x-3">
            <div className="h-8 w-8 rounded-full bg-slate-200" />
            <div>
              <span className="block text-sm font-medium text-gray-700">
                아뇽
              </span>
              <span className="block text-xs text-gray-500 ">2시간 전</span>
              <p className="mt-2 text-gray-700">
                잘봤습니다^^
              </p>
            </div>
          </div>
        </div>
        <div className="px-4">
          <TextArea
            name="description"
            placeholder="댓글을 입력해주세요."
            required
          />
          <button className="mt-2 w-full rounded-md border border-transparent bg-blue-400 py-2 px-4 text-sm font-medium  text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            댓글달기
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityDetail;
