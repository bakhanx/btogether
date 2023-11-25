import { cls } from "@libs/client/utils";

type ButtonProps = {
  large?: boolean;
  text: string;
  [key: string]: any;
  color?: "blue" | "amber";
};

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
          ? "bg-blue-500 hover:bg-blue-600 focus:ring-blue-600 "
          : color === "amber"
          ? "bg-amber-500 hover:bg-amber-600 focus:ring-amber-600"
          : color === "red"
          ? "bg-red-500 hover:bg-red-600 focus:ring-red-600"
          : " bg-gray-500 hover:cursor-auto focus:ring-0"
      )}
    >
      {text}
    </button>
  );
}
