import { cls } from "@libs/client/utils";
import { useEffect, useState } from "react";

export type ProductCategory = "Product" | "Free" | "Gather";
export type StoryCategory = "Daily" | "Review" | "Info" | "Ask";

type CategoryButtonType = {
  text: string;
  onClick?: React.MouseEventHandler;
  value?: ProductCategory | StoryCategory;
  color: string;
  category: ProductCategory | StoryCategory;
  [key: string]: any;
};

export default function CategoryButton({
  text,
  value,
  category,
  color,
  ...rest
}: CategoryButtonType) {
  type ColorType = {
    blue: string;
    green: string;
    orange: string;
    purple: string;
    [key: string]: string;
  };

  const colorVariants: ColorType = {
    blue: "border-blue-600",
    orange: "border-orange-600",
    green: "border-green-600",
    purple: "border-purple-600",
  };
  const hoverColorVariants: ColorType = {
    blue: "hover:border-blue-600",
    orange: "hover:border-orange-600",
    green: "hover:border-green-600",
    purple: "hover:border-purple-600",
  };
  return (
    <button
      className={cls(
        category === value
          ? `${colorVariants[color]}`
          : `border-gray-300 ${hoverColorVariants[color]}`,
        `rounded-sm  p-2 text-sm border-2 `
      )}
      {...rest}
      value={value}
    >
      {text}
    </button>
  );
}
