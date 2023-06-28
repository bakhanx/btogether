import { Product } from "@prisma/client";
import Item from "./item";
import useSWR from "swr";

export interface ProductWithCount extends Product {
  _count: {
    records: number;
    chatRooms: number;
  };
}
interface ProductsResponse {
  ok: boolean;
  products: ProductWithCount[];
}

const ProductsList = () => {
  const { data: productsData } = useSWR<ProductsResponse>(`/api/products`);

  return (
    <>
      {/* 작성된 게시글 리스트 */}
      {productsData && (
        <div className="flex flex-col space-y-1 divide-y py-1">
          {productsData?.products.map((product) => (
            <Item
              id={product?.id}
              image={product?.image}
              key={product?.id}
              title={product?.name}
              time={product?.updatedAt}
              price={product?.price}
              hearts={product?._count?.records || 0}
              comments={product?._count?.chatRooms || 0}
            ></Item>
          ))}
        </div>
      )}
    </>
  );
};

export default ProductsList;
