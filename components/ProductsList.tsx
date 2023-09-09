import { Product } from "@prisma/client";
import Item from "./item";
import useSWRInfinite from "swr/infinite";
import { useEffect, useRef, useState } from "react";
import { usePagination } from "@libs/client/usePagination";

export interface ProductWithCount extends Product {
  _count: {
    records: number;
    chatRooms: number;
  };
  sellState: "selling" | "reserve" | "sold"
}
type ProductsResponse = {
  ok: boolean;
  products: ProductWithCount[];
  pages: number;
}

const getKey = (pageIndex: number, previousPageData: ProductsResponse) => {
  // console.log(pageIndex);
  if (pageIndex === 0) return `/api/products?page=1`;
  if (pageIndex + 1 > previousPageData.pages) return null;
  return `/api/products?page=${pageIndex + 1}`;
};

const ProductsList = () => {
  const { data, setSize } = useSWRInfinite<ProductsResponse>(getKey, {
    suspense: true,
  });
  const products = data ? data.map((item) => item.products).flat() : [];
  const page = usePagination();
  useEffect(() => {
    setSize(page);
  }, [page, setSize]);

  return (
    <>
      {/* 작성된 게시글 리스트 */}

      <div className="flex flex-col space-y-1 divide-y py-1">
        {products.map((product) => (
          <Item
            id={product?.id}
            image={product?.image}
            key={product?.id}
            title={product?.name}
            time={product?.updatedAt}
            price={product?.price}
            hearts={product?._count?.records || 0}
            comments={product?._count?.chatRooms || 0}
            sellState={product?.sellState}
          ></Item>
        ))}
      </div>
    </>
  );
};

export default ProductsList;
