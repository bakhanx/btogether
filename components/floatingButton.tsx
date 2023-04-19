import Link from "next/link";

interface FloatingButton {
  children: React.ReactNode;
  href: string;
}

export default function FloatingButton({ children, href }: FloatingButton) {
  return (
    <Link href={href}>
      <div className="fixed bottom-24 right-5 flex aspect-square w-14 cursor-pointer items-center justify-center rounded-full border-0 border-transparent bg-blue-500 text-white shadow-xl transition-colors hover:bg-blue-600 ">
        {children}
      </div>
    </Link>
  );
}
