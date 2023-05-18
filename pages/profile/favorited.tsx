import { NextPage, NextPageContext } from "next";
import Item from "@components/item";
import Layout from "@components/layout";
import useSWR, { SWRConfig } from "swr";
import { Kind, Product, Record } from "@prisma/client";
import ProductList from "@components/product-list";
import { withSsrSession } from "@libs/server/withSession";
import client from "@libs/server/client";

const Favorited: NextPage = () => {
  return (
    <Layout title="관심 목록" seoTitle="내 관심목록" canGoBack hasTabBar>
      <div className=" flex flex-col space-y-2 divide-y py-2">
        {<ProductList />}
      </div>
    </Layout>
  );
};

const Page: NextPage<{ records: Record }> = ({ records }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/users/me/records": {
            ok: true,
            records,
          },
        },
      }}
    >
      <Favorited />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(
  async ({ req, query }: NextPageContext) => {
    const records = await client.record.findMany({
      where: {
        userId: req?.session?.user?.id,
        kind: query?.kind as Kind
      },
      include: {
        product: {
          include: {
            _count: {
              select: {
                records: true,
              },
            },
          },
        },
      },
    });

    return {
      props: {
        favorites: JSON.parse(JSON.stringify(records)),
      },
    };
  }
);

export default Page;
