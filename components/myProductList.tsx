import { Product } from "@prisma/client";
import useSWR from "swr";
import Item from "./item";
import { sellStateType } from "./sellStateLabel";

type KindType = {
  kind: "Favorite" | "Sale" | "Purchase";
};

type ProductResponse = {
  [key: string]: Record[];
};

type Record = {
  id: number;
  product: ProductWithCount;
};
interface ProductWithCount extends Product {
  _count: {
    records: number;
    chatRooms: number;
  };
}

const MyProductList = ({ kind }: KindType) => {
  const { data } = useSWR<ProductResponse>(
    `/api/users/me/records?kind=${kind}`,
    { suspense: true }
  );
  return (
    <>
      <div className="flex flex-col space-y-2 divide-y py-2">
        {data?.records?.map((record: Record) => (
          <Item
            key={record?.product.id}
            id={record?.product.id}
            title={record?.product.name}
            time={record?.product.updatedAt}
            price={record?.product.price}
            image={record?.product.image}
            hearts={record?.product._count.records}
            comments={record?.product._count.chatRooms}
            sellState={record?.product.sellState as sellStateType}
          />
        ))}
      </div>
    </>
  );
};

export default MyProductList;
