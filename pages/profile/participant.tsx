import { NextPage } from "next";
import Layout from "@components/layout";
import MyProductList from "@components/myProductList";
import { Suspense } from "react";
import Loading from "@components/loading";

const Participant: NextPage = () => {
  return (
    <Layout
      title="참여 내역"
      seoTitle="내 참여 내역"
      canGoBack
      hasTabBar
      pathName="Profile"
    >
      <Suspense fallback={<Loading />}>
        <MyProductList kind="Purchase" category={"Gather"}/>
      </Suspense>
    </Layout>
  );
};

export default Participant;
