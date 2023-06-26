import { NextPage } from "next";
import FloatingButton from "@components/floatingButton";
import Item from "@components/item";
import Layout from "@components/layout";
import { Product } from "@prisma/client";
import client from "@libs/server/client";
import { useRouter } from "next/router";
import useSWR, { SWRConfig } from "swr";
import { useEffect } from "react";

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
  const { data: productsData, isLoading } =
    useSWR<ProductsResponse>(`/api/products`);
  return (
    <>
      {/* 작성된 게시글 리스트 */}
      {productsData ? (
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
      ) : (
        "Not found 404"
      )}
    </>
  );
};

const Home: NextPage = () => {
  return (
    <Layout
      hasTabBar
      mainTitle
      seoTitle="이웃과 함께하는"
      writeBtnPath="product"
    >
      <ProductsList />
    </Layout>
  );
};

// export async function getStaticProps() {
//   const products = await client?.product.findMany({
//     include: {
//       _count: {
//         select: {
//           chatRooms: true,
//           records: {
//             where: {
//               kind: { equals: "Favorite" },
//             },
//           },
//         },
//       },
//     },
//     orderBy: {
//       updatedAt: "desc",
//     },
//   });
//   return {
//     props: {
//       products: JSON.parse(JSON.stringify(products)),
//     },
//   };
// }

const Page: NextPage<{ products: ProductWithCount[] }> = ({ products }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/products": {
            ok: true,
            products,
          },
        },
      }}
    >
      <Home />
    </SWRConfig>
  );
};

export async function getServerSideProps() {
  const products = await client?.product.findMany({
    take: 8,
    orderBy: {
      updatedAt: "desc",
    },
  });
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}

export default Page;
