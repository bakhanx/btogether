import { cls } from "@libs/client/utils";
import { useState } from "react";

export type ProductCategory = "Product" | "Free" | "Gather";
export type StoryCategory = "Daily" | "Review" | "Info" | "Ask";

type CategoryButtonType = {
  text: string;
  onClick?: React.MouseEventHandler;
  value?: ProductCategory | StoryCategory;
  [key: string]: any;
  color: "blue" | "orange" | "red" | "green" | "violet";
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
        category === value ? `border-${color}-600` : "border-gray-300",
        `rounded-sm  p-2 text-sm border-2 hover:border-${color}-600`
      )}
      value={value}
    >
      {text}
    </button>
  );
}
