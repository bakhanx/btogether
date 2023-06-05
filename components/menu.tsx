import useUser from "@libs/client/useUser";
import { User } from "@prisma/client";
import { useRouter } from "next/router";

export default function Menu() {
  const router = useRouter();


  return (
    <div className="absolute right-2">
      <div>
        <button type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
            />
          </svg>
        </button>
      </div>

      <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">

        {/* 유저가 판매자일 경우 */}
        <div className="py-1">
          <a href="#" className="block px-4 py-2 text-sm text-gray-700">
            수정하기
          </a>
          <a href="#" className="block px-4 py-2 text-sm text-red-500">
            삭제하기
          </a>
        </div>

        {/* 유저가 구매자일 경우 */}
        <div className="py-1">
          <a href="#" className="block px-4 py-2 text-sm text-red-500">
            신고하기
          </a>
        </div>
      </div>
    </div>
  );
}
