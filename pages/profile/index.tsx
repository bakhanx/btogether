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
        <Link href="/profile/edit" className="hover:opacity-80">
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
                className="block rounded-md border p-[2px] text-xs font-medium text-gray-700 hover:bg-blue-200"
              >
                로그아웃
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
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

      {/* 내 히스토리 */}
      <div className="mt-10 flex justify-around">
        {/* 판매내역 */}
        <Link href="/profile/sale">
          <div className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-400 text-white">
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
            <span className="text-gray-70 mt-2 text-sm font-medium">
              판매내역
            </span>
          </div>
        </Link>

        {/* 구매내역 */}
        <Link href="/profile/purchase">
          <div className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-400 text-white">
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
            <span className="text-gray-70 mt-2 text-sm font-medium">
              구매내역
            </span>
          </div>
        </Link>

        {/* 관심목록 */}
        <Link href="/profile/favorite">
          <div className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-400 text-white">
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
            <span className="text-gray-70 mt-2 text-sm font-medium">
              관심목록
            </span>
          </div>
        </Link>
      </div>

      {/* 나에 대한 리뷰 */}
      <Review />
    </div>
  );
};

const Profile: NextPage = () => {
  return (
    <Layout
      canGoBack
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
