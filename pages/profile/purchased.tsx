import { NextPage, NextPageContext } from "next";
import Layout from "@components/layout";
import { SWRConfig } from "swr";
import { Purchase, Sale } from "@prisma/client";
import ProductList from "@components/product-list";
import { withSsrSession } from "@libs/server/withSession";
import client from "@libs/server/client";

const Purchased: NextPage = () => {
  return (
    <Layout title="구매 내역" seoTitle="내 구매내역" canGoBack hasTabBar>
      <div className=" flex flex-col space-y-2 divide-y py-2">
        {<ProductList kind="purchases" />}
      </div>
    </Layout>
  );
};

const Page: NextPage<{ purchases: Purchase }> = ({ purchases }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/users/me/purchases": {
            ok: true,
            purchases,
          },
        },
      }}
    >
      <Purchased />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(
  async ({ req }: NextPageContext) => {
    const purchases = await client.purchase.findMany({
      where: {
        userId: req?.session?.user?.id,
      },
      select: {
        product: {
          include: {
            _count: {
              select: {
                favorites: true,
              },
            },
          },
        },
      },
    });

    return {
      props: {
        purchases: JSON.parse(JSON.stringify(purchases)),
      },
    };
  }
);

export default Page;
