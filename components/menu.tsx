import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";


export default function Menu(props:{
  type: "Product" | "Story";
  isWriter:boolean;
  onDelete: (event:React.MouseEvent<HTMLButtonElement>)=>void;
  onModify:  (event:React.MouseEvent<HTMLButtonElement>)=>void;
}) {
  const [isOnMenu, setisOnMenu] = useState(false);

  // const onDelete = (event: any) => {
  //   event.preventDefault();
  // };

  const onClickMenu = ()=>{
    setisOnMenu(!isOnMenu);
  }

  return (
    <div className="absolute right-2">
      <div>
        <button onClick={onClickMenu} type="button">
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
      {isOnMenu ? (
        <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {props.isWriter ? (
            // 판매자 UI
            <div className="py-1">
              <button onClick={props.onModify} className="block w-full py-2 pr-10 text-sm text-gray-700 hover:bg-slate-100">
                수정하기
              </button>
              <button
                onClick={props.onDelete}
                className="block  w-full py-2 pr-10 text-sm text-red-500 hover:bg-slate-100"
              >
                삭제하기
              </button>
            </div>
          ) : (
            // 구매자 UI
            <div className="py-1">
              <button className="block w-full py-2 pr-10 text-sm text-red-500">
                신고하기
              </button>
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
