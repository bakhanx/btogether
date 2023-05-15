import { NextPage } from "next";
import Message from "@components/message";
import Layout from "@components/layout";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import useUser from "@libs/client/useUser";

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const { register, reset, handleSubmit } = useForm();
  const { data: chatData, mutate } = useSWR(`/api/chats/${router.query.id}`, {
    refreshInterval: 1000,
  });
  const user = useUser();
  const [sendMutation, { loading, data }] = useMutation(
    `/api/chats/${router.query.id}/message`
  );

  const onValid = (form: any) => {
    if (loading) return;

    reset();
    mutate((prev: any) => {
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
      };
    }, false);

    sendMutation(form);
  };

  return (
    <Layout title="판매왕김스프" seoTitle={`판매왕김스프님과의 대화`} canGoBack>
      <div className="space-y-4 py-10 px-4 pb-16">
        <Message message="안녕하세요!" />
        {/* 메시지 */}
        {chatData?.chatRoom?.messages?.map((message: any) => (
          <div key={message.id}>
            <Message reversed message={message.message} />
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
