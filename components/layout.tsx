import Link from "next/link";
import { useRouter } from "next/router";
import { cls } from "../libs/client/utils";
import Head from "next/head";

interface LayoutProps {
  title?: string;
  canGoBack?: boolean;
  hasTabBar?: boolean;
  seoTitle?: string;
  children: React.ReactNode; // 왜 필요한가
}

export default function Layout({
  title,
  canGoBack,
  hasTabBar,
  seoTitle,
  children,
}: LayoutProps) {
  const router = useRouter();
  const onClick = () => {
    router.back();
  };
  return (
    <div>
      <Head>
        <title>{`${seoTitle} # 비투게더`}</title>
      </Head>

      {/* 상단 탭 */}
      <div className="fixed top-0 z-50 flex h-12 w-full max-w-screen-lg  items-center justify-center  bg-blue-500 px-10 text-lg font-medium text-white ">
        {/* 뒤로가기 */}
        {canGoBack ? (
          <button onClick={onClick} className="absolute left-4">
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
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
        ) : null}
        {/* 타이틀 */}
        {title ? (
          <span className={cls(canGoBack ? "mx-auto" : "", "")}>{title}</span>
        ) : null}
      </div>

      {/* 메인 컨텐츠 */}
      <div className={cls("pt-12", hasTabBar ? "pb-24" : "")}>{children}</div>

      {/* 하단 탭 */}
      {hasTabBar ? (
        <nav className="fixed bottom-0 flex w-full max-w-screen-lg justify-between border-t bg-gray-50 px-10 pb-5 pt-3 text-xs text-gray-600">
          {/* Link 하위에 a태그 사용시 Link에 legacyBehavior 추가 */}

          {/* 홈 */}
          <Link href="/">
            <div
              className={cls(
                "flex flex-col items-center space-y-2",
                router.pathname === "/"
                  ? "text-blue-500"
                  : "transition-colors hover:text-gray-500"
              )}
            >
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
              <span>홈</span>
            </div>
          </Link>
          {/* 스토리 */}
          <Link href="/community">
            <div
              className={cls(
                "flex flex-col items-center space-y-2",
                router.pathname === "/community"
                  ? "text-blue-500"
                  : "transition-colors hover:text-gray-500"
              )}
            >
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
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                ></path>
              </svg>
              <span>스토리</span>
            </div>
          </Link>

          {/* 채팅 */}
          <Link href="/chats">
            <div
              className={cls(
                "flex flex-col items-center space-y-2",
                router.pathname === "/chats"
                  ? "text-blue-500"
                  : "transition-colors hover:text-gray-500"
              )}
            >
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              <span>채팅</span>
            </div>
          </Link>
          {/* 프로필 */}
          <Link href="/profile">
            <div
              className={cls(
                "flex flex-col items-center space-y-2",
                router.pathname === "/profile"
                  ? "text-blue-500"
                  : "transition-colors hover:text-gray-500"
              )}
            >
              {" "}
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              <span>마이페이지</span>
            </div>
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
