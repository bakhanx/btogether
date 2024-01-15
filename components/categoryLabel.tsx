import { cls } from "@libs/client/utils";
import { Category } from "@prisma/client";
import { StoryCategory } from "./categoryButton";

export type CategoryProps = {
  routeType: "Product" | "Story";
  category: Category | StoryCategory;
  large?: boolean;
};

enum parseCategory {
  "Product" = "판매",
  "Free" = "나눔",
  "Gather" = "모임",
  "Daily" = "일상",
  "Review" = "후기",
  "Info" = "정보",
  "Ask" = "질문",
}

const CategoryLabel = ({
  routeType,
  category,
  large = false,
}: CategoryProps) => {
  return (
    <>
      {routeType === "Product" && (
        <span
          className={cls(
            "mr-1 rounded-sm  text-white ",
            category === "Product"
              ? "bg-blue-700"
              : category === "Free"
              ? "bg-orange-700"
              : category === "Gather"
              ? "bg-green-700 "
              : "",
            large ? "p-3 text-sm" : "p-1 text-xs"
          )}
        >
          {parseCategory[category]}
        </span>
      )}
      {routeType === "Story" && (
        <span
          className={cls(
            "ml-3.5 rounded-full px-2.5 py-0.5 font-bold text-white ",
            category === "Daily"
              ? "bg-violet-600"
              : category === "Review"
              ? "bg-green-600"
              : category === "Info"
              ? "bg-blue-600 "
              : category === "Ask"
              ? "bg-orange-600 "
              : "",
            large ? "p-3 text-sm" : "p-1 text-xs"
          )}
        >
          {parseCategory[category]}
        </span>
      )}
    </>
  );
};

export default CategoryLabel;
