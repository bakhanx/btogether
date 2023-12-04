import { useRouter } from "next/router";
import Menu from "./menu";
import { cls } from "@libs/client/utils";
import Head from "next/head";

type MenuType = "Product" | "Comment" | "Story";

type MenuProps = {
  menuProps: {
    type: MenuType;
    writerId: number;
    seoTitle : string;
    onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onModify?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  };
};

export default function TopNav({ menuProps: props }: MenuProps) {
  const router = useRouter();
  const onBack = () => {
    router.back();
  };
  return (
    <div
      className={cls(
        props.type === "Product"
          ? "bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-purple-500/50 "
          : props.type === "Story"
          ? "bg-gradient-to-r from-pink-500 via-amber-500 to-yellow-500"
          : "",
        "fixed top-0 z-10 flex h-12 w-full max-w-screen-lg  items-center justify-between  px-5 text-lg font-medium text-white"
      )}
    >
      <Head>
        <title>{`${props.seoTitle} # 비투게더`}</title>
      </Head>
      {/* 뒤로가기 */}

      <button
        onClick={onBack}
        className="backdrop-opacity-100"
        aria-label="뒤로가기"
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
