import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Button from "@components/button";
import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import useUser from "@libs/client/useUser";
import Image from "next/image";
import client from "@libs/server/client";
import Layout from "@components/layout";
import { useEffect, useState } from "react";
import TopNav from "@components/topNav";
import DateTime from "@components/datetime";
import { ProductResponse } from "types/product";
import { SKELETON } from "constants/skeleton";
import Loading from "@components/loading";
import ScrollToTopButton from "@components/scrollToTopButton";

const Product: NextPage<ProductResponse> = ({ product, relatedProducts }) => {
  const router = useRouter();

  const { user } = useUser();
  const {
    data: productData,
    mutate: boundMutate,
    isLoading,
  } = useSWR<ProductResponse>(
    router.query.id ? `/api/products/${router.query.id} ` : null
  );
  const [sellStateMutate] = useMutation(
    `/api/products/${router.query.id}/sellState`
  );

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

  const handleFavoriteClick = () => {
    toggleFavorite({});
    if (!productData) return;
    boundMutate(
      (prev) =>
        prev && {
          ...prev,
          product: {
            ...prev.product,
            _count: {
              ...prev.product?._count,
              records: prev.isFavorite
                ? prev.product._count.records - 1
                : prev.product._count.records + 1,
            },
          },
          isFavorite: !prev.isFavorite,
        },
      false
    );
  };

  //====================채팅방 =============================

  // 채팅방 이동 Modal
  const handleChatClick = () => {
    setIsShow(true);
  };
  const handleCancle = () => {
    setIsShow(false);
  };
  // 방생성 요청
  const handleCreateChatRoom = () => {
    if (loading) return;
    chatMutate({ id: router.query.id });
  };
  // 채팅방 생성
  useEffect(() => {
    if (chatData?.ok) {
      router.push(
        `/chat/${chatData?.chats?.id}?name=${chatData?.chats?.seller?.name}`
      );
    }
  }, [chatData, router]);

  // 채팅방 이미 존재
  useEffect(() => {
    if (chatData?.ok === false) {
      router.push(
        `/chat/${productData?.myChatRoomId}?name=${productData?.product?.seller.name}`
      );
    }
  }, [router, chatData, productData]);

  //본인 포스트일 경우
  const handleMoveChatList = () => {
    router.push(`/chat`);
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
    router.back();
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
      router.replace("/", undefined, {unstable_skipClientCache:true});
    }
  }, [deleteData, router]);

  const onModify = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.push(`/product/${router.query.id}/modify`);
  };

  //============================= 판매 상태 변경 =======================
  const [isOnPurchaser, setIsOnPurchaser] = useState(false);
  const [stateType, setStateType] = useState("selling");
  const showUserList = () => {
    setIsOnPurchaser(!isOnPurchaser);
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const state = String(event.target.value);
    setStateType(state);
    if (state !== "selling") {
      showUserList();
    } else {
      if (confirm("거래중으로 변경하시겠습니까?")) {
        sellStateMutate({ sellState: state });
      }
    }
  };

  const [selectedUserId, setselectedUserId] = useState(0);

  const selectedUser = (
    event: React.MouseEvent<HTMLDivElement>,
    id: number
  ) => {
    // event.preventDefault();
    setselectedUserId(id);
  };

  const confirmSelectedUser = () => {
    sellStateMutate({ sellState: stateType, purchaserId: selectedUserId });
    // router.reload();
  };

  //========================================================================

  if (router.isFallback) {
    return (
      <Layout
        canGoBack
        seoTitle="로딩중..."
        title="로딩중..."
        pathName="Product"
      >
        <Loading />
      </Layout>
    );
  }

  //===================== 이미지 확대 ===========================
  const handleImageClick = () => {
    setIsOnImage(!isOnImage);
  };

  return (
    <div className="flex justify-center">
      {/* 유저리스트 */}
      {isOnPurchaser && (
        <div className="relative flex justify-center ">
          <div className="fixed top-1/2 -translate-y-1/2 z-50 flex h-96 w-2/3 max-w-xl   bg-black bg-opacity-60 text-white ">
            <div className="flex h-full w-full flex-col justify-around">
              <div
                className="absolute top-2 right-2 cursor-pointer"
                onClick={showUserList}
              >
                ❌
              </div>
              <div className="p-2 text-center">
                {stateType === "reserve" ? "예약자" : "구매자"} 선택
              </div>

              <div className="group h-80 divide-y-2  overflow-auto p-5">
                {productData?.product?.chatRooms?.map((chatRoom) => (
                  <div
                    className={cls(
                      chatRoom.purchaser.id === selectedUserId
                        ? "bg-white text-black"
                        : " hover:bg-white hover:text-black",
                      "flex w-full cursor-pointer items-center gap-x-2 p-2"
                    )}
                    key={chatRoom.id}
                    onClick={(e) => selectedUser(e, chatRoom.purchaser.id)}
                  >
                    <div className="relative h-9 w-9 ">
                      <Image
                        alt=""
                        src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${chatRoom?.purchaser.avatar}/avatar`}
                        fill
                        priority
                        className="rounded-full"
                      />
                    </div>
                    {chatRoom.purchaser.name}
                  </div>
                ))}
              </div>
              <button
                className="bg-slate-900 p-3  hover:bg-slate-500"
                onClick={confirmSelectedUser}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 이미지 확대 */}
      {isOnImage ? (
        <div className="fixed left-0 z-20 flex h-full w-full items-start bg-black">
          <button className="z-50 m-5 text-white" onClick={handleImageClick}>
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
            className="object-scale-down"
            quality={100}
            priority
            fill
            alt=""
            src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${product?.image}/public`}
          />
        </div>
      ) : (
        ""
      )}

      {/* ==================== 메인 ========================== */}

      {/* 탑 레이아웃 */}
      <TopNav
        menuProps={{
          type: "Product",
          writerId: productData?.product?.sellerId || 0,
          onDelete: onDelete,
          onModify: onModify,
          seoTitle: productData?.product?.name || "",
        }}
      />

      {/* 판매 내용 */}
      <div className="mt-16 px-4 max-w-screen-md w-full">
        {/* 상품 이미지 */}
        <div onClick={handleImageClick}>
          <div className="w-full h-auto">
            {product?.image ? (
              <Image
                className="object-cover focus:cursor-pointer rounded-lg"
                quality={90}
                priority={true}
                // blurData를 위한 w,h 명시
                width={736}
                height={552}
                // style={{ width: "100%", height: "auto" }}
                src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${product?.image}/public`}
                placeholder="blur"
                blurDataURL={SKELETON.IMAGE}
                alt=""
              />
            ) : (
              <div className="w-full bg-gray-300 rounded-lg" />
            )}
          </div>
        </div>

        <div className="px-4 py-4">
          {/* Profile */}
          <div className="flex cursor-pointer items-center space-x-3 border-t border-b py-3">
            {productData?.product?.seller.avatar ? (
              <Image
                className="h-12 w-12 rounded-full"
                width={48}
                height={48}
                alt=""
                src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${productData?.product?.seller.avatar}/avatar`}
                blurDataURL={SKELETON.IMAGE}
                placeholder="blur"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-slate-300" />
            )}

            <div>
              <p className="text-sm font-medium text-gray-700">
                {productData?.product?.seller.name}
              </p>

              <Link href={`/users/profile/${productData?.product?.seller.name}`}>
                <p className="text-xs font-medium text-gray-500">
                  프로필 보기 &rarr;
                </p>
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="mt-5">
            <div className="pb-2">
              {product.sellerId === user?.id ? (
                <select
                  id="sellState"
                  className=" rounded-lg border border-gray-300 bg-violet-700 p-1 py-2 text-sm text-white shadow-md "
                  onChange={handleStateChange}
                  defaultValue={product.sellState}
                >
                  {/* <option selected></option> */}
                  <option value="selling">거래중</option>
                  <option value="reserve">예약중</option>
                  <option value="sold">거래완료</option>
                </select>
              ) : (
                <span className="inline-block rounded-lg bg-violet-700 p-5 py-2 text-sm text-white shadow-md">
                  {product.sellState === "selling" && "판매중"}
                  {product.sellState === "reserve" && "예약중"}
                  {product.sellState === "sold" && "판매완료"}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              {product?.name}
            </h1>
            <div className="mt-1 text-slate-500">
              <DateTime date={product?.createdAt} timeAgo />
            </div>
            <span className="mt-3 block text-2xl text-gray-900">
              {product?.price.toLocaleString()}원
            </span>
            <p className=" my-6 text-gray-700">{product?.description}</p>
            <div className="my-3 flex gap-x-3 text-sm text-slate-500">
              <div>채팅 · {productData?.product?._count?.chatRooms || 0}</div>
              <div>관심 · {productData?.product?._count?.records || 0}</div>
            </div>

            <div className="flex items-center justify-between space-x-2">
              {productData?.product?.sellState === "selling" &&
                (productData?.product?.seller?.id === user?.id ? (
                  <Button
                    onClick={handleMoveChatList}
                    large
                    text="채팅 목록"
                    color="blue"
                  />
                ) : (
                  <Button
                    onClick={handleChatClick}
                    large
                    text="거래하기 (채팅)"
                    color="blue"
                  />
                ))}
              {productData?.product?.sellState === "reserve" && (
                <Button large text="예약중입니다" />
              )}
              {productData?.product?.sellState === "sold" && (
                <Button large text="거래완료된 상품입니다" />
              )}
              {isLoading && <Button large text="거래 준비중..." />}
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
                          onClick={handleCreateChatRoom}
                        >
                          이동
                        </button>
                        <button
                          type="button"
                          onClick={handleCancle}
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
              {product.sellerId !== user?.id && (
                <button
                  onClick={handleFavoriteClick}
                  className={cls(
                    "flex items-center justify-center rounded-md p-3",
                    productData?.isFavorite
                      ? " text-red-500 hover:bg-gray-100 hover:text-gray-500"
                      : " text-gray-500 hover:bg-gray-100 hover:text-red-500"
                  )}
                  aria-label="관심상품등록"
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
              )}
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
                  <Link href={`/product/${product.id}`}>
                    {/* <div className="mb-4 h-56 w-full bg-slate-300" /> */}
                    <div className="w-full aspect-video mb-4 relative">
                      <Image
                        className="object-cover focus:cursor-pointer"
                        quality={90}
                        width={384}
                        height={0}
                        loading="lazy"
                        blurDataURL={SKELETON.IMAGE}
                        placeholder="blur"
                        alt=""
                        src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${product?.image}/public`}
                      />
                    </div>
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

      {/* Floating Button */}
      <ScrollToTopButton />
    </div>
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
