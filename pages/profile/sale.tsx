import { NextPage } from "next";
import Layout from "@components/layout";
import MyProductList from "@components/myProductList";
import { Suspense } from "react";
import Loading from "@components/loading";

const Sale: NextPage = () => {
  return (
    <Layout
      title="관심 목록"
      seoTitle="내 관심목록"
      canGoBack
      hasTabBar
      pathName="Profile"
    >
      <Suspense fallback={<Loading />}>
        <MyProductList kind="Sale"/>
      </Suspense>
    </Layout>
  );
};

export default Sale;
