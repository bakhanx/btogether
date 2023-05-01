import { cls } from "@libs/client/utils";

interface ButtonProps {
  large?: boolean;
  text: string;
  [key: string]: any;
}

export default function Button({ large = false, text, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={cls(
        "w-full rounded-md border border-transparent bg-blue-400 px-4 font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        large ? "py-3 text-base" : "py-2 text-sm"
      )}
    >
      {text}
    </button>
  );
}
