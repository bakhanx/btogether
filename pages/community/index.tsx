import { NextPage } from "next";
import Link from "next/link";
import FloatingButton from "../../components/floatingButton";
import Layout from "../../components/layout";

const Community: NextPage = () => {
  return (
    <Layout hasTabBar canGoBack title="이웃 소식">
      <div className="divide space-y-2 divide-y-4 divide-blue-100">
        {[1, 2, 3, 4, 5].map((_, i) => (
          <div key={i}>
            <Link href={`/community/${i}`}>
              <div className="flex cursor-pointer flex-col items-start pt-4">
                <span className="ml-3.5 flex items-center rounded-full bg-violet-500 px-2.5 py-0.5 text-xs font-bold text-white">
                  후기
                </span>
                <div className="mt-2 px-4 text-gray-7100 font-medium">
                  <span>치약 공동구매 후기입니다.</span>
                </div>
                <div className=" mt-5 flex w-full items-center justify-between px-4 text-sm font-medium text-gray-500">
                  <span>김첨지</span>
                  <span>36분전</span>
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
            </Link>
          </div>
        ))}
         <FloatingButton href="/community/write">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Community;
