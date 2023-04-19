import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Button from "@components/button";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { Product } from "@prisma/client";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import useUser from "@libs/client/useUser";
import Image from "next/image";
import client from "@libs/server/client";
import Layout from "@components/layout";

interface ProductWithUser extends Product {
  user: {
    id: number;
    name: string;
    avatar: string;
  };
}
interface ProductResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isFavorite: Boolean;
}

const Product: NextPage<ProductResponse> = ({
  product,
  relatedProducts,
}) => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { data, mutate: boundMutate } = useSWR<ProductResponse>(
    router.query.id ? `/api/products/${router.query.id} ` : null
  );
  const { mutate: unboundMutate } = useSWRConfig(); // unbound mutate

  const [toggleFavorite] = useMutation(
    `/api/products/${router.query.id}/favorite`
  );
  const onFavoriteClick = () => {
    toggleFavorite({});
    if (!data) return;
    boundMutate(
      (prev) => prev && { ...prev, isFavorite: !prev.isFavorite },
      false
    );
    // unboundMutate("/api/users/me", (prev:any)=> prev && {ok:!prev.ok}, false);
  };

  if (router.isFallback) {
    return (
      <Layout canGoBack seoTitle="로딩중..." title="로딩중...">
        <div className="text-center">Loading...</div>
      </Layout>
    );
  }
  return (
    <Layout canGoBack seoTitle={product?.name}>
      <div className="">
        {/* 판매 내용 */}
        <div className="mb-8 ">
          <div className="flex justify-center">
            {product?.image ? (
              <div className="relative h-96 w-full">
                <Image
                  className="object-cover"
                  fill
                  alt=""
                  src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${product?.image}/public`}
                />
              </div>
            ) : (
              <div className="h-96 bg-slate-300" />
            )}
          </div>

          <div
            className="px-4 py-4
              "
          >
            {/* Profile */}
            <div className="flex cursor-pointer items-center space-x-3 border-t border-b py-3">
              {product?.user?.avatar ? (
                <Image
                  className="h-12 w-12 rounded-full"
                  width={48}
                  height={48}
                  alt=""
                  src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${product.user.avatar}/public`}
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-slate-300" />
              )}

              <div>
                <p className="text-sm font-medium text-gray-700">
                  {product.user.name}
                </p>

                <Link href={`/users/profile/${product.user.name}`}>
                  <p className="text-xs font-medium text-gray-500">
                    프로필 보기 &rarr;
                  </p>
                </Link>
              </div>
            </div>

            {/* Content */}
            <div className="mt-5">
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>
              <span className="mt-3 block text-2xl text-gray-900">
                \{product.price}
              </span>
              <p className=" my-6 text-gray-700">{product.description}</p>
              <div className="flex items-center justify-between space-x-2">
                <Button large text="거래하기 (채팅)" />
                <button
                  onClick={onFavoriteClick}
                  className={cls(
                    "flex items-center justify-center rounded-md p-3",
                    data?.isFavorite
                      ? " text-red-500 hover:bg-gray-100 hover:text-gray-500"
                      : " text-gray-400 hover:bg-gray-100 hover:text-red-500"
                  )}
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={data?.isFavorite ? "currentColor" : "none"}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* 유사 상품 추천 */}
            <div className="py-4">
              <h2 className="text-2xl font-bold text-gray-900">
                관련된 상품 추천
              </h2>
              <div className=" mt-6 grid grid-cols-2 gap-4">
                {relatedProducts.map((product) => (
                  <div key={product.id}>
                    <Link href={`/products/${product.id}`}>
                      <div className="mb-4 h-56 w-full bg-slate-300" />
                      <h3 className="-mb-1 text-gray-700">{product.name}</h3>
                      <span className="text-sm font-medium text-gray-900">
                        \{product.price}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const product = await client.product.findUnique({
    where: {
      id: Number(context?.params?.id),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
    },
  };
};

export default Product;
