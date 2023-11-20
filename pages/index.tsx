import { NextPage } from "next";
import Layout from "@components/layout";
import { Suspense, lazy } from "react";
import Loading from "@components/loading";
import Slogan from "../components/slogan";
import ProductsList from "../components/ProductsList";

// const ProductsList = lazy(() => import("../components/ProductsList"));

const Home: NextPage = () => {
  return (
    <Layout hasTabBar mainTitle seoTitle="이웃과 함께하는" pathName="Product">
      <Slogan />
      <Suspense fallback={<Loading />}>
        <ProductsList />
      </Suspense>
    </Layout>
  );
};

export default Home;
