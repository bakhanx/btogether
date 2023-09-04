import useUser from "@libs/client/useUser";
import { useState } from "react";

export default function Menu(props: {
  type: "Product" | "Story" | "Comment";
  writerId: number;
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onModify?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const [isOnMenu, setisOnMenu] = useState(false);

  const { user } = useUser();

  // const onDelete = (event: any) => {
  //   event.preventDefault();
  // };

  const onClickMenu = () => {
    setisOnMenu(!isOnMenu);
  };
  const onLeaveFocusOut = () => {
    setTimeout(() => {
      setisOnMenu(false);
    }, 100);
  };

  return (
    <div className="relative right-1">
      <button onClick={onClickMenu} type="button" onBlur={onLeaveFocusOut}>
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

      {isOnMenu ? (
        <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {props.writerId === user?.id ? (
            // 작성자 UI
            <div className="py-1">
              {props.type !== "Comment" && (
                <button
                  onClick={props.onModify}
                  className="block w-full py-2 pr-10 text-sm text-gray-700 hover:bg-slate-100"
                >
                  수정하기
                </button>
              )}
              <button
                onClick={props.onDelete}
                className="block  w-full py-2 pr-10 text-sm text-red-500 hover:bg-slate-100"
              >
                삭제하기
              </button>
            </div>
          ) : (
            // 뷰어 UI
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
