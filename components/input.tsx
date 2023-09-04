import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  kind?: "text" | "phone" | "price";
  register: UseFormRegisterReturn;
  type: React.HTMLInputTypeAttribute;
  required:boolean,
  value?:string,
  [key: string]: any;
}

export default function Input({
  label,
  name,
  kind = "text",
  register,
  required,
  type,
  value,
  ...rest
}: InputProps) {
  return (
    <div>
      <label
        className="mb-1 block text-sm font-medium text-gray-700"
        htmlFor={name}
      >
        {label}
      </label>
      {kind === "text" ? (
        <div className="relative flex items-center  rounded-md shadow-sm">
          <input
            id={name}
            {...register}
            required={required}
            type={type}
            {...rest}
            className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:placeholder-transparent focus:outline-none focus:ring-blue-500"
          />
        </div>
      ) : null}
      {kind === "price" ? (
        <div className="relative flex items-center  rounded-md shadow-sm">
          <div className="pointer-events-none absolute left-0 flex items-center justify-center pl-3">
            <span className="text-sm text-gray-500">₩</span>
          </div>
          <input
            id={name}
            {...register}
            required={required}
            value={value}
            type={type}
            {...rest}
            className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pl-7 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:placeholder-transparent focus:outline-none focus:ring-blue-500"
          />
          <div className="pointer-events-none absolute right-0 flex items-center pr-3">
            <span className="text-gray-500">KRW</span>
          </div>
        </div>
      ) : null}
      {kind === "phone" ? (
        <div className="flex rounded-md shadow-sm">
          <span className="flex select-none items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
            +82
          </span>
          <input
            id={name}
            type={type}
            required={required}
            {...register}
            {...rest}
            className="w-full rounded-md rounded-l-none border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:placeholder-transparent focus:outline-none focus:ring-blue-500"
          />
        </div>
      ) : null}
    </div>
  );
}
