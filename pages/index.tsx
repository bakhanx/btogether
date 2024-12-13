import Layout from "@components/layout";
import Slogan from "../components/slogan";
import { Product } from "@prisma/client";
import Item from "../components/item";
import useSWRInfinite from "swr/infinite";
import { useEffect, useState } from "react";
import { usePagination } from "@libs/client/usePagination";
import { SellingType } from "types/product";
import { GetStaticProps, NextPage } from "next";
import client from "@libs/server/client";
import ScrollToTopButton from "@components/scrollToTopButton";
import Image from "next/image";
import Loader from "../public/Spinner.svg";

export interface ProductWithCount extends Product {
  _count: {
    records: number;
    chatRooms: number;
  };
  sellState: SellingType;
}
type ProductsResponse = {
  ok: boolean;
  products: ProductWithCount[];
  pages: number;
};

const getKey = (pageIndex: number, previousPageData: ProductsResponse) => {
  if (
    previousPageData &&
    (!previousPageData.ok || pageIndex + 1 > previousPageData.pages)
  )
    return null;
  return `/api/products?page=${pageIndex + 1}`;
};

const Home: NextPage<ProductsResponse> = ({ products, pages }) => {
  const [productList, setProductList] = useState(products);
  const { data, setSize, isValidating } =
    useSWRInfinite<ProductsResponse>(getKey);

  const page = usePagination(pages);
  useEffect(() => {
    setSize(page);
  }, [page, setSize]);

  useEffect(() => {
    if (data) {
      const newProducts = data.map((item) => item.products).flat();
      setProductList(newProducts);
    }
  }, [data]);

  return (
    <>
      {/* 작성된 게시글 리스트 */}
      <Layout hasTabBar mainTitle seoTitle="이웃과 함께하는" pathName="Product">
        <Slogan />
        <div className="flex flex-col  divide-y-4 divide-purple-50 py-1">
          {productList.map((product) => (
            <Item
              id={product?.id}
              image={product?.image}
              key={product?.id}
              title={product?.name}
              time={product?.createdAt}
              price={product?.price}
              hearts={product?._count?.records || 0}
              comments={product?._count?.chatRooms || 0}
              sellState={product?.sellState}
              category={product?.category}
              isModify={product?.isModify}
            />
          ))}
        </div>
        {isValidating && (
          <div className="flex w-full justify-center">
            <Image src={Loader} priority={true} alt="" width={80} height={80} />
          </div>
        )}

        {/* Floating Button */}
        <ScrollToTopButton hasBottomTab />
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await client.product.findMany({
    include: {
      _count: {
        select: {
          records: {
            where: {
              kind: {
                equals: "Favorite",
              },
            },
          },
          chatRooms: true,
        },
      },
    },
    take: 8,
    orderBy: {
      updatedAt: "desc",
    },
  });
  const productsCount = await client.product.count();
  const totalPages = Math.ceil(productsCount / 8);
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      pages: totalPages,
    },
  };
};

export default Home;
