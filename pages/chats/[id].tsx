import { GetServerSideProps, NextPage, NextPageContext } from "next";
import Chat from "@components/message";
import Layout from "@components/layout";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useSWR, { SWRConfig, unstable_serialize } from "swr";
import useUser, { UserResponse } from "@libs/client/useUser";
import { ChatRoomWithUsers } from ".";
import { Message, User } from "@prisma/client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import client from "@libs/server/client";
import { withSsrSession } from "@libs/server/withSession";

interface ChatRoomResponse {
  ok: boolean;
  chatRoom: ChatRoomWithUsers;
}

const ChatDetail = () => {
  const router = useRouter();
  const { register, reset, handleSubmit } = useForm();
  const { data: chatData, mutate } = useSWR<ChatRoomResponse>(
    router.query.id ? `/api/chats/${router.query.id}` : null,
    {
      refreshInterval: 1000,
    }
  );

  const { data: userData} = useSWR<UserResponse>(`/api/users/me`);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [sendMutation, { loading, data }] = useMutation(
    `/api/chats/${router.query.id}/message`
  );

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData]);

  const onValid = (form: any) => {
    if (loading) return;
    reset();

    mutate((prev) => {
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

    sendMutation(form);
  };
  const chatTitle =
    chatData.chatRoom.sellerId === userData?.profile?.id
      ? chatData.chatRoom.purchaser.name
      : chatData.chatRoom.seller.name;

  return (
    <Layout
      title={`${chatTitle}님과의 대화`}
      seoTitle={chatData?.chatRoom.product.name}
      canGoBack
    >
      {chatData ? (
        <>
          <div className="fixed z-50 w-full max-w-screen-xl border-b-2 border-b-blue-200 bg-white px-4">
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
                <div>
                  <span>{chatData?.chatRoom.product.sellstate}</span>
                  <span className="bold text-blue-500">[거래중] </span>
                  <span>{chatData?.chatRoom.product.name}</span>
                </div>
                <div>{chatData?.chatRoom.product.price}원</div>
              </div>
            </div>
          </div>
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
              <div className="relative mx-auto flex w-full max-w-screen-xl items-center px-5">
                <input
                  {...register("message", { required: true })}
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-3  pl-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 right-6 flex py-1.5">
                  <button className="flex items-center rounded-md bg-blue-400 px-5 text-white focus:ring-2 focus:ring-blue-50 focus:ring-offset-2 ">
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
      ) : (
        "Loading..."
      )}
    </Layout>
  );
};

const Page: NextPage<{ chatRoom: ChatRoomWithUsers; profile: User }> = ({
  chatRoom,
  profile,
}) => {
  const router = useRouter();
  const apiKey = `/api/chats/${router.query.id}`;
  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize(apiKey)]: {
            ok: true,
            chatRoom,
          },
          "api/users/me": {
            ok: true,
            profile,
          },
        },
      }}
    >
      <ChatDetail />
    </SWRConfig>
  );
};

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

export default Page;
