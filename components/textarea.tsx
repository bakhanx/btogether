import { UseFormRegisterReturn } from "react-hook-form";

type TextAreaProps = {
  label?: string;
  name?: string;
  color?: string;
  register: UseFormRegisterReturn;
  [key: string]: any;
}

export default function TextArea({
  label,
  name,
  register,
  color="blue",
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
        className={`mt-1 w-full resize-none rounded-md border-2 border-gray-300 p-1 shadow-sm focus:border-${color}-500 focus:placeholder-transparent focus:ring-${color}-500 focus:outline-none`}
        rows={4}
        {...rest}
      />
    </div>
  );
}
