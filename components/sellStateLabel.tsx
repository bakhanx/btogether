import { SellingType } from "types/product";

export type sellStateProps = {
  sellState: SellingType;
  hideSelling?: boolean;
}

const SellStateLabel = ({ sellState, hideSelling }: sellStateProps) => {
  return (
    <>
      {sellState === "reserve" && (
        <span className=" mr-1 rounded-sm bg-green-600 p-1 text-xs text-white">
          예약중
        </span>
      )}
      {sellState === "sold" && (
        <span className=" mr-1 rounded-sm bg-gray-500 p-1 text-xs text-white">
          거래완료
        </span>
      )}

      {!hideSelling && sellState === "selling" && (
        <span className=" mr-1 rounded-sm bg-violet-500 p-1 text-xs text-white">
          거래중
        </span>
      )}
    </>
  );
};

export default SellStateLabel;
