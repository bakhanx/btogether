import { NextPage, NextPageContext } from "next";
import Link from "next/link";
import Layout from "@components/layout";

import Image from "next/image";
import { SWRConfig } from "swr";
import { User } from "@prisma/client";
import { withSsrSession } from "@libs/server/withSession";
import client from "@libs/server/client";
import useSWR from "swr";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { UserResponse } from "types/user";
import Review from "@components/review";

const UserInfo = () => {
  const router = useRouter();
  const { data: userData, isLoading } = useSWR<UserResponse>(`/api/users/me`);
  const [logout, { data: logoutData, loading }] =
    useMutation("/api/users/logout");

  // ============== 로그아웃 ==================
  const onLogout = (event: any) => {
    event.preventDefault();
    if (!loading) {
      logout({});
    }
  };

  useEffect(() => {
    if (logoutData?.ok) {
      router.reload();
    }
  }, [router, logoutData]);

  // =============================================

  return (
    <div className="px-4">
      {/* 내 프로필 */}
      <div className="mt-4 flex items-center space-x-3">
        <Link
          href="/profile/edit"
          className="hover:opacity-80"
          aria-label="프로필사진"
        >
          {userData ? (
            userData?.profile?.avatar ? (
              <div className="relative h-16 w-16">
                <Image
                  src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${userData?.profile?.avatar}/avatar`}
                  alt=""
                  fill
                  priority
                  sizes="1"
                  className="rounded-full"
                />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-full bg-slate-500" />
            )
          ) : (
            <div className="h-16 w-16 rounded-full bg-slate-500" />
          )}
        </Link>
        <div>
          <span className="space-y-1 font-bold text-gray-900">
            <Link href="/profile/edit" className="hover:text-gray-500">
              {userData?.profile?.name || "　"}
            </Link>
            {/* 로그아웃 */}
            <div className="translate-y-1">
              <button
                onClick={onLogout}
                className="block rounded-md border p-[2px] text-xs font-medium text-gray-700 hover:bg-blue-50"
              >
                로그아웃
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  // strokeWidth={1.5}
                  stroke="currentColor"
                  className="inline h-3 w-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
              </button>
            </div>
          </span>
        </div>
      </div>

      <div className="mt-5 w-full h-4 bg-gradient-to-r to-blue-500 from-purple-500 opacity-20" />

      {/* 내 히스토리 */}
      <div className="mt-2 flex flex-col divide-y-2 divide-purple-100">
        {/* 판매내역 */}
        <Link href="/profile/sale">
          <div className="flex items-center py-3 gap-x-2 hover:bg-gray-100">
            <div className="text-blue-500">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
            <div className="text-gray text-sm font-medium ">판매내역</div>
          </div>
        </Link>
        {/* 모집내역 */}
        <Link href="/profile/gather ">
          <div className="flex items-center py-3 gap-x-2 hover:bg-gray-100">
            <div className="text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46"
                />
              </svg>
            </div>
            <div className="text-gray text-sm font-medium ">모집내역</div>
          </div>
        </Link>

        {/* 관심목록 */}
        <Link href="/profile/favorite">
          <div className="flex items-center  py-3 gap-x-2 hover:bg-gray-100">
            <div className="text-blue-500">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </div>
            <span className="text-sm font-medium">관심목록</span>
          </div>
        </Link>
        <div className=" w-full h-1 bg-gradient-to-r to-blue-500 from-purple-500 opacity-20" />

        {/* 구매내역 */}
        <Link href="/profile/purchase">
          <div className="flex items-center  py-3 gap-x-2 hover:bg-gray-100">
            <div className="text-blue-500">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                ></path>
              </svg>
            </div>
            <span className="text-gray text-sm font-medium">구매내역</span>
          </div>
        </Link>
        {/* 참여내역 */}
        <Link href="/profile/participant">
          <div className="flex items-center  py-3 gap-x-2 hover:bg-gray-100">
            <div className="text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"
                />
              </svg>
            </div>
            <span className="text-gray text-sm font-medium">참여내역</span>
          </div>
        </Link>
      </div>

      <div className="mt-2 w-full h-4 bg-gradient-to-r to-blue-500 from-purple-500 opacity-20" />

      {/* 나에 대한 리뷰 */}
      <Review />
    </div>
  );
};

const Profile: NextPage = () => {
  return (
    <Layout
      title="마이페이지"
      seoTitle="내 프로필"
      hasTabBar
      pathName="Profile"
    >
      <UserInfo />
    </Layout>
  );
};

const Page: NextPage<{ profile: User }> = ({ profile }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/users/me": {
            ok: true,
            profile,
          },
        },
      }}
    >
      <Profile />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(async function ({
  req,
}: NextPageContext) {
  const profile = await client?.user.findUnique({
    where: {
      id: req?.session?.user?.id,
    },
  });
  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
    },
  };
});

export default Page;
