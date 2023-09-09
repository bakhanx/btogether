import { UseFormRegisterReturn } from "react-hook-form";

type TextAreaProps = {
  label?: string;
  name?: string;
  register: UseFormRegisterReturn;
  [key: string]: any;
}

export default function TextArea({
  label,
  name,
  register,
  ...rest
}: TextAreaProps) {
  return (
    <div>
      {label ? (
        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      ) : null}

      <textarea
        id={name}
        {...register}
        className="mt-1 w-full resize-none rounded-md border border-gray-300 p-1 shadow-sm focus:border-blue-500 focus:placeholder-transparent focus:ring-blue-500"
        rows={4}
        {...rest}
      />
    </div>
  );
}
