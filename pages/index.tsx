import { NextPage } from "next";
import FloatingButton from "@components/floatingButton";
import Item from "@components/item";
import Layout from "@components/layout";
import { Product } from "@prisma/client";
import client from "@libs/server/client";

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
  return (
    <Layout hasTabBar mainTitle seoTitle="이웃과 함께하는">
      {/* 작성된 게시글 리스트 */}
      <div className="flex flex-col space-y-1 divide-y py-2">
        {products?.map((product) => (
          <Item
            id={product?.id}
            image={product?.image}
            key={product?.id}
            title={product?.name}
            price={product?.price}
            hearts={product?._count?.records || 0}
            comments={product?._count?.chatRooms || 0}
          ></Item>
        ))}
      </div>

      {/* 게시글 작성 버튼 */}
      <FloatingButton href="/products/upload">
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </FloatingButton>
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
