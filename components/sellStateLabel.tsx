import { cls } from "@libs/client/utils";
import { SellingType } from "types/product";

export type sellStateProps = {
  sellState: SellingType;
  hideLabel?: boolean;
};

enum parseSellType {
  "selling" = "판매중",
  "sold" = "판매완료",
  "reserve" = "예약중",
}

const SellStateLabel = ({ sellState, hideLabel }: sellStateProps) => {
  return (
    <>
        <span
          className={cls(
            "mr-1 rounded-full p-[3px] text-[10px] leading-4 text-white font-bold",
            sellState === "selling"
              ? "bg-blue-700 hidden"
              : sellState === "sold"
              ? "bg-orange-500 hidden"
              : sellState === "reserve"
              ? "bg-purple-600 "
              : ""
          )}
        >
          {parseSellType[sellState]}
        </span>
      {/* {sellState === "reserve" && (
        <span className=" mr-1 rounded-sm bg-green-700 p-1 text-xs text-white">
          예약중
        </span>
      )}
      {! hideLabel && sellState === "sold" && (
        <span className=" mr-1 rounded-sm bg-gray-600 p-1 text-xs text-white">
          완료
        </span>
      )}

      {!hideLabel && sellState === "selling" && (
        <span className=" mr-1 rounded-sm bg-violet-700 p-1 text-xs text-white">
          진행중
        </span>
      )} */}
    </>
  );
};

export default SellStateLabel;
