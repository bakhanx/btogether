import { cls } from "@libs/client/utils";
import { SellingType } from "types/product";

export type sellStateProps = {
  sellState: SellingType;
  hideLabel?: boolean;
  large?: boolean;
};

enum parseSellType {
  "selling" = "진행중",
  "sold" = "완료",
  "reserve" = "예약중",
}

const SellStateLabel = ({ sellState, hideLabel, large }: sellStateProps) => {
  return (
    <>
      <span
        className={cls(
          "mr-1  leading-4 text-white",
          sellState === "selling"
            ? "bg-violet-500 "
            : sellState === "sold"
            ? "bg-gray-500 "
            : sellState === "reserve"
            ? "bg-rose-700 "
            : "",
          large === true
            ? "p-3 text-sm rounded-sm "
            : "p-[3px] text-[10px] rounded-full",
          !large && sellState !== "reserve" ? "hidden" : ""
        )}
      >
        {parseSellType[sellState]}
      </span>
    </>
  );
};

export default SellStateLabel;
