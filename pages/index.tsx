import { NextPage } from "next";
import Layout from "@components/layout";
import { SWRConfig } from "swr";
import { Suspense, lazy } from "react";
import Loading from "@components/loading";

const ProductsList = lazy(()=> import('../components/ProductsList'));

const Home: NextPage = () => {
  return (
    <Layout hasTabBar mainTitle seoTitle="이웃과 함께하는" pathName="Product">
      <Suspense fallback={<Loading />}>
        <ProductsList />
      </Suspense>
    </Layout>
  );
};

export default Home;
