import { cls } from "@libs/client/utils";
import { Category } from "@prisma/client";

export type CategoryProps = {
  category: Category;
  hideLabel?: boolean;
};

enum parseCategory {
  "Product" = "판매",
  "Free" = "나눔",
  "Gather" = "모임",
}

const CategoryLabel = ({ category, hideLabel }: CategoryProps) => {
  return (
    <>
      <span
        className={cls(
          "mr-1 rounded-sm p-1 text-xs text-white ",
          category === Category.Product
            ? "bg-blue-600"
            : category === Category.Free
            ? "bg-orange-600"
            : category === Category.Gather
            ? "bg-green-600 " 
            : ""
        )}
      >
        {parseCategory[category]}
      </span>

      {/* {category === "Product" && (
        <span className=" mr-1 rounded-sm bg-green-700 p-1 text-xs text-white">
          판매
        </span>
      )}
      {category === "Free" && (
        <span className=" mr-1 rounded-sm bg-gray-600 p-1 text-xs text-white">
          나눔
        </span>
      )}

      {category === "Gather" && (
        <span className=" mr-1 rounded-sm bg-violet-700 p-1 text-xs text-white">
          모임
        </span>
      )} */}
    </>
  );
};

export default CategoryLabel;
