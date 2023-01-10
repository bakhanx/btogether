import Link from "next/link";
import { useRouter } from "next/router";
import { cls } from "../lib/utils";

interface LayoutProps {
  title?: string;
  canGoBack?: boolean;
  hasTabBar?: boolean;
  children: React.ReactNode; // 왜 필요한가
}

export default function Layout({
  title,
  canGoBack,
  hasTabBar,
  children,
}: LayoutProps) {
  const router = useRouter();
  const onClick = () => {
    router.back();
  };
  return (
    <div>
      <div className="max-w-x1 fixed top-0 flex h-12 w-full items-center justify-center border-b bg-white px-10 text-lg font-medium text-gray-800">
        {canGoBack ? (
          <button onClick={onClick}>
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
        {title ? (
          <span className={cls(canGoBack ? "mx-auto" : "", "")}></span>
        ) : null}
      </div>
      <div className={cls("pt-12", hasTabBar ? "pb-24" : "")}>{children}</div>
      {hasTabBar ? (
        <nav>
            {/* Link 하위에 a태그 사용시 Link에 legacyBehavior 추가 */}
          <Link href="/">
            <div
              className={cls(
                "flex flex-col items-center space-y-2",
                router.pathname === "/"
                  ? "text-orange-500"
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
        </nav>
      ) : (
        ""
      )}
    </div>
  );
}
