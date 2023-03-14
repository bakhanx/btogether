import { NextPage } from "next";
import FloatingButton from "@components/floatingButton";
import Item from "@components/item";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import Head from "next/head";
import useSWR from "swr";
import { Product } from "@prisma/client";

interface ProductsResponse {
  ok: boolean;
  products: Product[];
}

const Home: NextPage = () => {
  const { user, isLoading } = useUser();
  const { data } = useSWR<ProductsResponse>("api/products");

  console.log(data);

  return (
    <Layout hasTabBar title="B-Together">
      <Head>
        <title>Home</title>
      </Head>

      {/* 작성된 게시글 리스트 */}
      <div className="flex flex-col space-y-2 divide-y py-2">
        {data?.products?.map((product) => (
          <Item
            id={product.id}
            key={product.id}
            title={product.name}
            price={product.price}
            comments={1}
            hearts={1}
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

export default Home;
