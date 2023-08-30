import { NextPage } from "next";
import Link from "next/link";
import { Story } from "@prisma/client";

import Layout from "@components/layout";
import DateTime from "@components/datetime";

import { Suspense, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import Loading from "@components/loading";
import { usePagination } from "@libs/client/usePagination";

interface StoryWithUserAndCount extends Story {
  _count: {
    likes: number;
    comments: number;
  };
  user: {
    name: string;
    id: number;
  };
}
interface StoryResponse {
  ok: boolean;
  stories: StoryWithUserAndCount[];
  pages: number;
}

const getKey = (pageIndex: number, previousPageData: StoryResponse) => {
  // console.log(pageIndex);
  if (pageIndex === 0) return `/api/stories?page=1`;
  if (pageIndex + 1 > previousPageData.pages) return null;
  return `/api/stories?page=${pageIndex + 1}`;
};

const StoryList = () => {
  const { data, setSize } = useSWRInfinite<StoryResponse>(getKey, {
    suspense: true,
  });
  const stories = data ? data.map((item) => item.stories).flat() : [];
  const page = usePagination();
  useEffect(() => {
    setSize(page);
  }, [page, setSize]);

  return (
    <>
      {stories && (
        <div className="divide space-y-1 divide-y-4 divide-slate-200">
          {stories.map((story) => (
            <div key={story.id}>
              <Link href={`/story/${story.id}`}>
                <div className="flex cursor-pointer flex-col items-start pt-4">
                  <span className="ml-3.5 flex items-center rounded-full bg-violet-500 px-2.5 py-0.5 text-xs font-bold text-white">
                    일상
                  </span>
                  <div className="text-gray-7100 mt-2 h-16 px-4">
                    <span className="line-clamp-2">{story.content}</span>
                  </div>
                  <div className=" mt-5 flex w-full items-center justify-between px-4 text-sm font-medium text-gray-500">
                    <span>{story.user?.name}</span>
                    <span>
                      <DateTime date={story.updatedAt} />
                    </span>
                  </div>
                  <div className="mt-3 flex w-full justify-start space-x-5 border-t px-4 py-2.5">
                    <span className="flex items-center space-x-2 text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="#0066ff"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                        />
                      </svg>

                      <span>좋아요 {story?._count?.likes || 0}</span>
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
                      <span>댓글 {story?._count?.comments || 0}</span>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const Main: NextPage = () => {
  return (
    <Layout
      hasTabBar
      canGoBack
      title="이웃 스토리"
      seoTitle="이웃 소식"
      pathName="Story"
    >
      <Suspense fallback={<Loading />}>
        <StoryList />
      </Suspense>
    </Layout>
  );
};

// const Page: NextPage = () => {
//   return (
//     <SWRConfig
//       value={{
//         suspense: true,
//       }}
//     >
//       <Main />
//     </SWRConfig>
//   );
// };

// export const getServerSideProps: GetServerSideProps = async () => {
//   const stories = await client.story.findMany({

//     orderBy: {
//       updatedAt: "desc",
//     },
//     take:8
//   });
//   return {
//     props: {
//       stories: JSON.parse(JSON.stringify(stories)),
//     },
//   };
// };

// export const getStaticProps: GetStaticProps = async () => {
//   const stories = await client?.story.findMany({
//     include: {
//       user: {
//         select: {
//           id: true,
//           name: true,
//         },
//       },

//       _count: {
//         select: {
//           comments: true,
//           likes: true,
//         },
//       },
//     },
//     orderBy: {
//       updatedAt: "desc",
//     },
//   });
//   return {
//     props: {
//       stories: JSON.parse(JSON.stringify(stories)),
//     },
//   };
// };

export default Main;
