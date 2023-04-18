import { NextPage, NextPageContext } from "next";
import Layout from "@components/layout";
import { SWRConfig } from "swr";
import { Sale } from "@prisma/client";
import ProductList from "@components/product-list";
import { withSsrSession } from "@libs/server/withSession";
import client from "@libs/server/client";

const Sold: NextPage = () => {
  return (
    <Layout title="판매 내역" seoTitle="내 판매내역" canGoBack hasTabBar>
      <div className=" flex flex-col space-y-2 divide-y py-2">
        {<ProductList kind="sales" />}
      </div>
    </Layout>
  );
};

const Page: NextPage<{ sales: Sale }> = ({ sales }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/users/me/sales": {
            ok: true,
            sales,
          },
        },
      }}
    >
      <Sold />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(
  async ({ req }: NextPageContext) => {
    const sales = await client.sale.findMany({
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
        sales: JSON.parse(JSON.stringify(sales)),
      },
    };
  }
);

export default Page;
