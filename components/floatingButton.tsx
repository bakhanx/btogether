import { cls } from "@libs/client/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FloatingButton {
  children: React.ReactNode;
  href: string;
}

export default function FloatingButton({ children, href }: FloatingButton) {
  //   const [windowWidth, setWindowWidth] = useState(0);
  //   useEffect(() => {
  //     function handleResize() {
  //       setWindowWidth(window.innerWidth);
  //     }
  //     window.addEventListener("resize", handleResize);
  //     handleResize();
  //     console.log(windowWidth);
  //   }, [windowWidth]);

  return (
    <div className="fixed bottom-24 flex w-full max-w-screen-xl justify-end pr-4 border-none">
      <Link href={href}>
        <div className=" bottom-24 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-0 border-transparent bg-blue-500 text-white shadow-xl transition-colors hover:bg-blue-600 ">
          {children}
        </div>
      </Link>
    </div>
  );
}
