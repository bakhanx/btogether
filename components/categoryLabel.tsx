import { cls } from "@libs/client/utils";
import { Category } from "@prisma/client";

export type CategoryProps = {
  category: Category;
  large?: boolean;
};

enum parseCategory {
  "Product" = "판매",
  "Free" = "나눔",
  "Gather" = "모임",
}

const CategoryLabel = ({ category, large = false }: CategoryProps) => {
  return (
    <>
      <span
        className={cls(
          "mr-1 rounded-sm  text-white ",
          category === Category.Product
            ? "bg-blue-600"
            : category === Category.Free
            ? "bg-orange-600"
            : category === Category.Gather
            ? "bg-green-600 "
            : "",
          large ? "p-3 text-sm" : "p-1 text-xs"
        )}
      >
        {parseCategory[category]}
      </span>
    </>
  );
};

export default CategoryLabel;
