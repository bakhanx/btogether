import { NextPage, NextPageContext } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useUser, { UserResponse } from "@libs/client/useUser";
import Image from "next/image";
import { SWRConfig } from "swr";
import { User } from "@prisma/client";
import { withSsrSession } from "@libs/server/withSession";
import client from "@libs/server/client";
import useSWR from "swr";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import { useEffect } from "react";

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
      <div className="mt-12">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-slate-500" />
          <div>
            <h4 className="text-sm font-bold text-gray-800">공구의신</h4>
            {/* 별점 */}
            <div className="flex items-center">
              {[1, 1, 1, 1, 1].map((_, i) => (
                <svg
                  key={i}
                  className="h-5 w-5 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          {/* 리뷰 내용*/}
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore quod
            tenetur nihil illum! Voluptatem doloribus numquam voluptates sed,
            sint eum quos tempore eius similique ipsa earum aspernatur nihil
            labore sapiente culpa odit doloremque tenetur in voluptate quae
            recusandae vitae! Quos fugiat alias perspiciatis nihil modi
            consequuntur illum temporibus distinctio sint nesciunt autem,
            impedit, inventore beatae sapiente tenetur eveniet illo hic soluta
            cumque quam odit blanditiis deleniti adipisci magni. Corporis
            ratione porro asperiores voluptatem. Deleniti animi ullam unde
            laborum, aspernatur doloribus! Maiores, natus assumenda! Id atque
            repudiandae tenetur cupiditate, eum vel in eligendi beatae totam
            delectus error dicta nisi numquam adipisci.
          </p>
        </div>
      </div>
    </div>
  );
};

const Profile: NextPage = () => {
  return (
    <Layout canGoBack title="마이페이지" seoTitle="내 프로필" hasTabBar pathName="Profile">
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
