import { NextPage, NextPageContext } from "next";
import Layout from "@components/layout";
import { SWRConfig } from "swr";
import ProductList from "@components/product-list";
import { withSsrSession } from "@libs/server/withSession";
import client from "@libs/server/client";
import { Record } from "@prisma/client";

const Sold: NextPage = () => {
  return (
    <Layout title="판매 내역" seoTitle="내 판매내역" canGoBack hasTabBar>
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
      <Sold />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(
  async ({ req }: NextPageContext) => {
    const records = await client.record.findMany({
      where: {
        userId: req?.session?.user?.id,
      },
      select: {
        product: {
          include: {
            _count: {
              select: {
                records: {
                  where: {
                    kind: {
                      equals: "Sale",
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      props: {
        records: JSON.parse(JSON.stringify(records)),
      },
    };
  }
);

export default Page;
