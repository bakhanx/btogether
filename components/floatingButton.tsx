import Image from "next/image";
import Link from "next/link";
import BottomLogo from '../public/images/logo/logo_01_small.png'

type FloatingButton = {
  pathName: "Product" | "Story" | "Chat" | "Profile";
};

export default function FloatingButton({ pathName }: FloatingButton) {
  return (
    <div className="relative bottom-28 z-40 flex max-w-screen-xl   justify-center border-none">
      {pathName === "Product" && (
        <Link href={"product/upload"} aria-label="글쓰기">
          <div className="bottom-24 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-0 border-transparent bg-gradient-to-t from-cyan-500 via-blue-500 to-purple-500 text-white shadow-xl transition-colors  hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600">
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
        </Link>
      )}

      {pathName === "Story" && (
        <Link href={"story/upload"} aria-label="글쓰기">
          <div className="bottom-24 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-0 border-transparent bg-gradient-to-t text-white shadow-xl transition-colors from-pink-500 via-amber-500 to-yellow-500 hover:from-pink-600 hover:via-amber-600 hover:to-yellow-600   ">
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
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
        </Link>
      )}

      {(pathName === "Chat" || pathName === "Profile") && (
        <div className="relative top-1 flex w-20 h-12">
          <Image
            fill
            priority
            className="mt-4 rotate-180 hue-rotate-60"
            sizes="1"
            alt=""
            src={BottomLogo}
          />
        </div>
      )}
    </div>
  );
}
