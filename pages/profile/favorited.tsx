import { NextPage, NextPageContext } from "next";
import Item from "@components/item";
import Layout from "@components/layout";
import useSWR, { SWRConfig } from "swr";
import { Favorite, Product } from "@prisma/client";
import ProductList from "@components/product-list";
import { withSsrSession } from "@libs/server/withSession";
import client from "@libs/server/client";

const Favorited: NextPage = () => {
  return (
    <Layout title="관심 목록" seoTitle="내 관심목록" canGoBack hasTabBar>
      <div className=" flex flex-col space-y-2 divide-y py-2">
        {<ProductList kind="favorites" />}
      </div>
    </Layout>
  );
};

const Page: NextPage<{favorites : Favorite}> = ({favorites}) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/users/me/favorites": {
            ok: true,
            favorites,
          },
        },
      }}
    >
      <Favorited />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(async ({
  req,
}: NextPageContext) => {
  const favorites = await client.favorite.findMany({
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
      favorites: JSON.parse(JSON.stringify(favorites)) 
    },
  };
});

export default Page;
