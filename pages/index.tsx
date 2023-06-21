import { NextPage } from "next";
import FloatingButton from "@components/floatingButton";
import Item from "@components/item";
import Layout from "@components/layout";
import { Product } from "@prisma/client";
import client from "@libs/server/client";
import { useRouter } from "next/router";
import useSWR from 'swr'
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

const Home: NextPage<ProductsResponse> = ({ products }) => {

  const router= useRouter();

  const {data, isLoading} = useSWR<ProductsResponse>(`/api/products`);

  useEffect(()=>{
    if(!isLoading){
      if(data?.products[0].id !== products[0].id){
        router.reload();
      }
    }
    
  },[router,data,products,isLoading])


  return (
    <Layout hasTabBar mainTitle seoTitle="이웃과 함께하는" writeBtnPath="product">
      {/* 작성된 게시글 리스트 */}
      <div className="flex flex-col space-y-1 divide-y py-1">
        {products?.map((product) => (
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
    </Layout>
  );
};

export async function getStaticProps() {
  const products = await client?.product.findMany({
    include: {
      _count: {
        select: {
          chatRooms: true,
          records: {
            where: {
              kind: { equals: "Favorite" },
            },
          },
        },
      },
    },
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

// const Page: NextPage<{ products: ProductWithCount[] }> = ({ products }) => {
//   return (
//     <SWRConfig
//       value={{
//         fallback: {
//           "/api/products": {
//             ok: true,
//             products,
//           },
//         },
//       }}
//     >
//       <Home />
//     </SWRConfig>
//   );
// };

// export async function getServerSideProps() {
//   const products = await client?.product.findMany({});
//   return {
//     props: {
//       products: JSON.parse(JSON.stringify(products)),
//     },
//   };
// }

export default Home;
