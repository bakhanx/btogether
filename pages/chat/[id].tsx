import Chat from "@components/message";
import Layout from "@components/layout";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { Message } from "@prisma/client";
import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Loading from "@components/loading";
import SellStateLabel from "@components/sellStateLabel";
import { ChatRoomResponse } from "types/chat";
import { UserResponse } from "types/user";
import { SellingType } from "types/product";
import useUser from "@libs/client/useUser";

const ProductInfo = () => {
  const router = useRouter();
  const { data: chatData } = useSWR<ChatRoomResponse>(
    `/api/chats/${router.query.id}`
  );
  return (
    <>
      <div className="fixed z-30 w-full max-w-screen-lg border-b-2 border-b-blue-100 bg-white px-4">
        <div className="flex items-center p-2">
          <div className="relative h-16 w-16 shadow-md">
            {chatData?.chatRoom?.product?.image ? (
              <Image
                src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${chatData?.chatRoom.product.image}/thumbnail`}
                alt=""
                fill
                priority
                sizes="1"
                className="rounded-md "
              />
            ) : (
              ""
            )}
          </div>

          <div className="px-4">
            <div className="flex">
              <SellStateLabel
                sellState={
                  chatData?.chatRoom?.product?.sellState as SellingType
                }
              />
              <span>{chatData?.chatRoom?.product?.name}</span>
            </div>
            <div>{chatData?.chatRoom?.product?.price}원</div>
          </div>
        </div>
      </div>
    </>
  );
};

const ChatContents = () => {
  const { register, reset, handleSubmit } = useForm();
  const router = useRouter();
  const { data: chatData, mutate } = useSWR<ChatRoomResponse>(
    `/api/chats/${router.query.id}`,
    {
      refreshInterval: 1000,
      suspense: true,
    }
  );

  const { data: userData } = useSWR<UserResponse>(`/api/users/me`);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [sendMutation, { loading, data }] = useMutation(
    `/api/chats/${router.query.id}/message`
  );

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ inline: "end" });
    // window.scrollTo(9999,9999)
  }, [router]);

  const onValid = async (form: any) => {
    if (loading) return;
    await mutate((prev) => {
      return (
        prev && {
          ...prev,
          chatRoom: {
            ...prev.chatRoom,
            messages: [
              ...prev.chatRoom?.messages,
              {
                id: Date.now(),
                createdAt: Date.now(),
                message: form.message,
                userId: userData?.profile.id,
              },
            ],
          },
        }
      );
    }, false);
    reset();
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });

    sendMutation(form);
  };

  return (
    <>
      <div className="max-screen-w-xl mx-auto w-full space-y-4 py-10 px-4 pb-24 pt-24">
        {/* 메시지 */}
        {chatData?.chatRoom?.messages?.map((message: Message) => (
          <div key={message.id}>
            {message?.userId !== userData?.profile?.id ? (
              <Chat
                message={message.message}
                avatar={
                  userData?.profile?.id === chatData?.chatRoom?.purchaserId
                    ? chatData?.chatRoom?.seller?.avatar
                    : chatData?.chatRoom?.purchaser?.avatar
                }
                time={message.createdAt}
              />
            ) : (
              <Chat
                reversed
                message={message.message}
                avatar={
                  userData?.profile?.id === chatData?.chatRoom?.purchaserId
                    ? chatData?.chatRoom?.purchaser?.avatar
                    : chatData?.chatRoom?.seller?.avatar
                }
                time={message.createdAt}
              />
            )}
          </div>
        ))}
        <div className="inline" ref={scrollRef}></div>

        {/* 메시지 입력 칸 */}
        <form
          onSubmit={handleSubmit(onValid)}
          className="fixed inset-x-0 bottom-0 bg-white py-5"
        >
          <div className="relative mx-auto flex w-full max-w-screen-lg items-center px-5">
            <input
              {...register("message", { required: true })}
              type="text"
              className="w-full rounded-md border border-gray-300 p-3  pl-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-6 flex py-1.5">
              <button className="flex items-center rounded-md bg-blue-500 px-5 text-white focus:ring-2 focus:ring-blue-50 focus:ring-offset-2 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

const ChatDetail = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data: chatData } = useSWR<ChatRoomResponse>(
    `/api/chats/${router.query.id}`
  );
  const [chatRoomName, setChatRoomName] = useState("");
  useEffect(() => {
    if (chatData) {
      if (chatData?.chatRoom.sellerId === user?.id) {
        setChatRoomName(chatData?.chatRoom?.purchaser.name);
      } else {
        setChatRoomName(chatData?.chatRoom.seller.name);
      }
    }
  }, [chatData, user]);

  return (
    <Layout
      title={`${chatRoomName}님과의 대화`}
      seoTitle={`${chatRoomName}`}
      canGoBack
      pathName="Chat"
    >
      <ProductInfo />
      <Suspense fallback={<Loading />}>
        <ChatContents />
      </Suspense>
    </Layout>
  );
};

/* ==================== SSR =====================
export const getServerSideProps: GetServerSideProps = withSsrSession(
  async ({ req, query }: NextPageContext) => {
    const chatRoom = await client.chatRoom.findUnique({
      where: {
        id: Number(query?.id),
      },
      include: {
        purchaser: true,
        seller: true,
        product: {
          select: {
            name: true,
            price: true,
            image: true,
            sellState: true,
          },
        },
        messages: true,
      },
    });
    const profile = await client.user.findUnique({
      where: {
        id: req?.session?.user?.id,
      },
    });

    return {
      props: {
        chatRoom: JSON.parse(JSON.stringify(chatRoom)),
        profile: JSON.parse(JSON.stringify(profile)),
      },
    };
  }
);
*/
export default ChatDetail;
