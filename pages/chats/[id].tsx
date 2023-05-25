import { NextPage } from "next";
import Chat from "@components/message";
import Layout from "@components/layout";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import useUser from "@libs/client/useUser";
import { ChatRoomWithUsers } from ".";
import { Message } from "@prisma/client";
import { useEffect, useRef } from "react";
import Image from "next/image";

interface ChatRoomResponse {
  ok: boolean;
  chatRoom: ChatRoomWithUsers;
}

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const { register, reset, handleSubmit } = useForm();
  const { data: chatData, mutate } = useSWR<ChatRoomResponse>(
    router.query.id ? `/api/chats/${router.query.id}` : null,
    {
      refreshInterval: 1000,
    }
  );
  const { user } = useUser();
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
                user: { ...user },
              },
            ],
          },
        }
      );
    }, false);

    sendMutation(form);
  };

  return (
    <Layout
      title={`${chatData?.chatRoom.seller.name}님과의 대화`}
      seoTitle={chatData?.chatRoom.product.name}
      canGoBack
    >
      <div className="fixed z-50 w-full max-w-screen-xl border-b-2 border-b-blue-200 bg-white px-4">
        <div className="flex items-center p-2">
          <div className="relative h-16 w-16">
            {chatData?.chatRoom?.product?.image ? (
              <Image
                src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${chatData?.chatRoom.product.image}/public`}
                alt=""
                fill
                priority
                sizes="1"
                className=""
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
            {message?.userId && message?.userId !== user?.id ? (
              <Chat
                message={message.message}
                avatar={
                  user?.id === chatData?.chatRoom?.purchaserId
                    ? chatData?.chatRoom?.seller?.avatar
                    : chatData?.chatRoom?.purchaser?.avatar
                }
              />
            ) : (
              <Chat
                reversed
                message={message.message}
                avatar={
                  user?.id === chatData?.chatRoom?.purchaserId
                    ? chatData?.chatRoom?.purchaser?.avatar
                    : chatData?.chatRoom?.seller?.avatar
                }
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
    </Layout>
  );
};

export default ChatDetail;
