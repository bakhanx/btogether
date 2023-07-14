import { cls } from "@libs/client/utils";

interface ButtonProps {
  large?: boolean;
  text: string;
  [key: string]: any;
  color?: "blue" | "amber";
}

export default function Button({
  large = false,
  text,
  color,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cls(
        "w-full rounded-md border border-transparent px-4 font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2",
        large ? "py-3 text-base" : "py-2 text-sm",
        color === "blue"
          ? "bg-blue-400 hover:bg-blue-500 focus:ring-blue-500 "
          : color === "amber"
          ? "bg-amber-400 hover:bg-amber-500 focus:ring-amber-500"
          : " bg-gray-400 hover:cursor-auto focus:ring-0"

      )}
    >
      {text}
    </button>
  );
}
