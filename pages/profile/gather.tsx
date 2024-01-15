import { NextPage } from "next";
import Layout from "@components/layout";
import MyProductList from "@components/myProductList";
import { Suspense } from "react";
import Loading from "@components/loading";

const Gather: NextPage = () => {
  return (
    <Layout
      title="모집 내역"
      seoTitle="내 모집 내역"
      canGoBack
      hasTabBar
      pathName="Profile"
    >
      <Suspense fallback={<Loading />}>
        <MyProductList kind="Sale" category={"Gather"}/>
      </Suspense>
    </Layout>
  );
};

export default Gather;
