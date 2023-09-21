import { NextPage } from "next";
import Layout from "@components/layout";
import MyProductList from "@components/myProductList";
import { Suspense } from "react";
import Loading from "@components/loading";

const Purchase: NextPage = () => {
  return (
    <Layout
      title="구매내역"
      seoTitle="내 구매내역"
      canGoBack
      hasTabBar
      pathName="Profile"
    >
      <Suspense fallback={<Loading />}>
        <MyProductList kind="Purchase"/>
      </Suspense>
    </Layout>
  );
};

export default Purchase;
