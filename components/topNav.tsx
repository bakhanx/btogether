import { useRouter } from "next/router";
import Menu from "./menu";
import { cls } from "@libs/client/utils";

interface MenuProps {
  menuProps: {
    type: "Product" | "Comment" | "Story";
    writerId: number;
    onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onModify?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  };
}

export default function TopNav({ menuProps: props }: MenuProps) {
  const router = useRouter();
  const onBack = () => {
    router.back();
  };
  return (
    <div
      className={cls(
        props.type === "Product"
          ? "bg-opacity-10"
          : props.type === "Story"
          ? "bg-gradient-to-r from-pink-500 via-amber-500 to-yellow-500"
          : "",
        "fixed top-0 z-10 flex h-12 w-full max-w-screen-lg  items-center justify-between bg-blue-300 px-5 text-lg font-medium text-white "
      )}
    >
      {/* 뒤로가기 */}

      <button onClick={onBack} className="">
        <svg
          className="h-6 w-6  "
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

      {/* 메뉴 */}

      <Menu
        type={props.type}
        writerId={props.writerId}
        onDelete={props.onDelete}
        onModify={props.onModify}
      />
    </div>
  );
}
