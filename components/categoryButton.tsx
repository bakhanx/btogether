import { cls } from "@libs/client/utils";
import { useState } from "react";

export type ProductCategory = "Product" | "Free" | "Gather";

type CategoryButtonType = {
  text: string;
  onClick?: React.MouseEventHandler;
  value?: ProductCategory;
  [key: string]: any;
  color : "blue" | "orange"
};

export default function CategoryButton({
  text,
  value,
  category,
  color,
  ...rest
}: CategoryButtonType) {
  return (
    <button
      {...rest}
      className={cls(
        category === value ? `border-${color}-500` : "border-gray-300",
        `rounded-sm  p-2 text-sm border-2 hover:border-${color}-500`
      )}
      value={value}
    >
      {text}
    </button>
  );
}
