import { NextPage } from "next";
import Layout from "@components/layout";
import { SWRConfig } from "swr";
import { Suspense, lazy, } from "react";
import Loading from "@components/loading";

const ProductsList = lazy(()=> import('../components/ProductsList') );

const Home: NextPage = () => {
  return (
    <Layout
      hasTabBar
      mainTitle
      seoTitle="이웃과 함께하는"
      writeBtnPath="product"
    >
      <Suspense fallback={<Loading />}>
        <ProductsList />
      </Suspense>
    </Layout>
  );
};

const Page: NextPage = () => {
  return (
    <SWRConfig value={{ suspense: true }}>
      <Home />
    </SWRConfig>
  );
};

// SSR
// export async function getServerSideProps() {
//   const products = await client?.product.findMany({
//     take: 8,
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

// SSG
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

export default Page;
