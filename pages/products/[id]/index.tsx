import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Button from "@components/button";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { ChatRoom, Product } from "@prisma/client";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import useUser from "@libs/client/useUser";
import Image from "next/image";
import client from "@libs/server/client";
import Layout from "@components/layout";
import { useEffect, useState } from "react";
import Menu from "@components/menu";

interface ProductWithUser extends Product {
  seller: {
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
  myChatRoomId: number;
}

const Product: NextPage<ProductResponse> = ({ product, relatedProducts }) => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { data: productData, mutate: boundMutate } = useSWR<ProductResponse>(
    router.query.id ? `/api/products/${router.query.id} ` : null
  );

  const { mutate: unboundMutate } = useSWRConfig(); // unbound mutate
  const [isShow, setIsShow] = useState(false);
  const [toggleFavorite] = useMutation(
    `/api/products/${router.query.id}/favorite`
  );

  const [chatMutate, { data: chatData, loading }] = useMutation(`/api/chats`);

  const [isOnImage, setIsOnImage] = useState(false);

  // 메뉴

  const [deleteMutation, { data: deleteData, loading: deleteLoading }] =
    useMutation(`/api/products/${router.query.id}/delete`);

  // 찜하기

  const onFavoriteClick = () => {
    toggleFavorite({});
    if (!productData) return;
    boundMutate(
      (prev) => prev && { ...prev, isFavorite: !prev.isFavorite },
      false
    );
    // unboundMutate("/api/users/me", (prev:any)=> prev && {ok:!prev.ok}, false);
  };

  //====================채팅방 =============================

  // 채팅방 이동 Modal
  const onClickChat = () => {
    setIsShow(true);
  };
  const onCancle = () => {
    setIsShow(false);
  };
  // 방생성 요청
  const OnCreateChatRoom = () => {
    if (loading) return;
    chatMutate({ id: router.query.id });
  };
  // 채팅방 생성
  useEffect(() => {
    if (chatData?.ok) {
      router.push(`/chats/${chatData?.chats?.id}`);
    }
  }, [chatData, router]);

  // 채팅방 이미 존재
  useEffect(() => {
    if (chatData?.ok === false) {
      router.push(`/chats/${productData?.myChatRoomId}`);
    }
  }, [router, chatData, productData]);

  //본인 포스트일 경우
  const onMoveChatList = () => {
    router.push(`/chats`);
  };

  // ===================== 삭제 / 수정 ===================

  const [isWriter, setIsWriter] = useState(false);
  useEffect(() => {
    if (productData?.product?.sellerId === user?.id) {
      setIsWriter(true);
    } else {
      setIsWriter(false);
    }
  }, [setIsWriter, productData, user]);

  const onBack = () => {
    router.push('/');
  };

  const onDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!deleteLoading) {
      deleteMutation({});
    }
  };
  
  useEffect(() => {
    if (deleteData?.ok) {
      alert("삭제가 완료되었습니다.");
      router.push("/");
    }
  }, [deleteData, router]);


  const onModify = (event: React.MouseEvent<HTMLButtonElement>)=>{
    event.preventDefault();
    router.push(`/products/${router.query.id}/modify`)
  }

  if (router.isFallback) {
    return (
      <Layout canGoBack seoTitle="로딩중..." title="로딩중...">
        <div className="text-center">Loading...</div>
      </Layout>
    );
  }

  //============================================================

  //===================== 이미지 확대 ===========================
  const onClickImage = () => {
    setIsOnImage(!isOnImage);
    if (isOnImage) {
    }
  };

  return (
    <>
      {/* 이미지 확대 */}
      {isOnImage ? (
        <div className="fixed z-20 flex h-full w-full items-start bg-black">
          <button className="z-50 m-5 text-white" onClick={onClickImage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <Image
            className="object-contain"
            priority
            fill
            alt=""
            src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${product?.image}/public`}
          />
        </div>
      ) : (
        ""
      )}

      {/* 메인 */}

      {/* 탑 레이아웃 */}
      <div className="fixed top-0 z-10 flex h-12 w-full max-w-screen-xl  items-center justify-center bg-black bg-opacity-0 px-10 text-lg font-medium text-white ">
        {/* 뒤로가기 */}
        <button onClick={onBack} className="absolute left-4">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
        {/* 메뉴 */}
        <Menu type={"Product"} isWriter={isWriter} onDelete={onDelete} onModify={onModify} />
      </div>

      {/* 판매 내용 */}
      <div className="mb-8 ">
        <div onClick={onClickImage}>
          {product?.image ? (
            <div className="relative h-96 w-full ">
              <Image
                className="object-cover focus:cursor-pointer"
                priority
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
            {product?.seller.avatar ? (
              <Image
                className="h-12 w-12 rounded-full"
                width={48}
                height={48}
                alt=""
                src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${product?.seller.avatar}/public`}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-slate-300" />
            )}

            <div>
              <p className="text-sm font-medium text-gray-700">
                {product?.seller.name}
              </p>

              <Link href={`/users/profile/${product?.seller.name}`}>
                <p className="text-xs font-medium text-gray-500">
                  프로필 보기 &rarr;
                </p>
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {product?.name}
            </h1>
            <span className="mt-3 block text-2xl text-gray-900">
              {product?.price.toLocaleString()}원
            </span>
            <p className=" my-6 text-gray-700">{product?.description}</p>

            <div className="flex items-center justify-between space-x-2">
              {productData?.product?.seller?.id === user?.id ? (
                <Button onClick={onMoveChatList} large text="채팅 목록" />
              ) : (
                <Button onClick={onClickChat} large text="거래하기 (채팅)" />
              )}

              {/* 거래하기 PopUp */}
              <div
                className={cls("relative z-10", isShow ? "show" : "hidden")}
                aria-labelledby="modal-title"
                role="dialog"
                aria-modal="true"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="h-6 w-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                              />
                            </svg>
                          </div>
                          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <h3
                              className="text-base font-semibold leading-6 text-gray-900"
                              id="modal-title"
                            >
                              거래 진행하기
                            </h3>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                판매자와의 채팅방으로 이동합니다.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 sm:ml-3 sm:w-auto"
                          onClick={OnCreateChatRoom}
                        >
                          이동
                        </button>
                        <button
                          type="button"
                          onClick={onCancle}
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 관심버튼 */}
              <button
                onClick={onFavoriteClick}
                className={cls(
                  "flex items-center justify-center rounded-md p-3",
                  productData?.isFavorite
                    ? " text-red-500 hover:bg-gray-100 hover:text-gray-500"
                    : " text-gray-400 hover:bg-gray-100 hover:text-red-500"
                )}
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={productData?.isFavorite ? "currentColor" : "none"}
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
                      {product.price}원
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
  //===============================================================
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
      seller: {
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