import Link from "next/link";

interface FloatingButton {
  writeBtnPath: string;
}

export default function FloatingButton({ writeBtnPath }: FloatingButton) {
  return (
    <div className="relative bottom-24 z-40 flex max-w-screen-xl   justify-center border-none">
      {writeBtnPath === "product" && (
        <Link href={"products/upload"}>
          <div className="bottom-24 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-0 border-transparent bg-blue-500 text-white shadow-xl transition-colors  hover:bg-blue-600 ">
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

      {writeBtnPath === "story" && (
        <Link href={"community/write"}>
          <div className="bottom-24 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-0 border-transparent bg-blue-500 text-white shadow-xl transition-colors  hover:bg-blue-600 ">
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
    </div>
  );
}
