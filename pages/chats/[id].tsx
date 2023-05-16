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
import { useEffect } from "react";
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
  const [sendMutation, { loading, data }] = useMutation(
    `/api/chats/${router.query.id}/message`
  );

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

  console.log(chatData);

  useEffect(()=>{

  },[chatData]);

  return (
    <Layout title={`${chatData?.chatRoom.seller.name}님과의 대화`} seoTitle={chatData?.chatRoom.product.name} canGoBack>
      <div className="bg-slate-100 px-4 fixed w-full">
        <div>
          <span>{chatData?.chatRoom.product.sellstate}</span>
          <span>{chatData?.chatRoom.product.name}</span>
        </div>
        <div>{chatData?.chatRoom.product.price}원</div>
        <div>{chatData?.chatRoom.product.image}</div>

      </div>
      <div className="space-y-4 py-10 px-4 pb-24 pt-24">
        {/* 메시지 */}
        {chatData?.chatRoom?.messages?.map((message: Message) => (
          <div key={message.id}>
            {message?.userId === user?.id ? (
              <Chat reversed message={message.message} />
            ) : (
              <Chat message={message.message} avatar={chatData?.chatRoom?.seller?.avatar} />
            )}
          </div>
        ))}

        {/* 메시지 입력 칸 */}
        <form
          onSubmit={handleSubmit(onValid)}
          className="fixed inset-x-0 bottom-0 bg-white py-5"
        >
          <div className="relative mx-auto flex w-full max-w-md items-center">
            <input
              {...register("message", { required: true })}
              type="text"
              className="w-full rounded-full border border-gray-300 p-3  pl-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-2 flex py-1.5">
              <button className="flex items-center rounded-full bg-blue-400 px-5 text-lg font-bold text-white focus:ring-2 focus:ring-blue-50 focus:ring-offset-2 ">
                &rarr;
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChatDetail;
