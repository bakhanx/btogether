import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { ChatRoom, Message } from "@prisma/client";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

// 상대 user 의 아바타, 아이디, 채팅내용.

export interface ChatRoomWithUsers extends ChatRoom {
  purchaser: {
    id: number;
    name: string;
    avatar: string;
  };
  seller: {
    id: number;
    name: string;
    avatar: string;
  };
  product: {
    name: string;
    price: number;
    image: string;
    sellstate: string;
  };
  messages: any;
}
interface ChatRoomsResponse {
  ok: boolean;
  chatRooms: ChatRoomWithUsers[];
}

const Chats: NextPage = () => {
  const { data } = useSWR<ChatRoomsResponse>("/api/chats");
  const { user } = useUser();

  return (
    <Layout title="채팅" hasTabBar canGoBack seoTitle="채팅">
      <div className="divide-y-2">
        {data?.chatRooms?.map((chatRoom) => (
          <Link
            href={`/chats/${chatRoom?.id}`}
            key={chatRoom?.id}
            className="block"
          >
            <div className="flex cursor-pointer justify-between ">
              <div className="flex items-center space-x-3 px-4 py-3">
                {/* 유저 아바타 */}
                <div className="relative h-12 w-12">
                  {user?.id === chatRoom.purchaserId ? (
                    chatRoom.seller.avatar ? (
                      <Image
                        src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${chatRoom.seller.avatar}/avatar`}
                        alt=""
                        fill
                        priority
                        sizes="1"
                        className="rounded-full"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-slate-500" />
                    )
                  ) : chatRoom.purchaser.avatar ? (
                    <Image
                      src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${chatRoom.purchaser.avatar}/avatar`}
                      alt=""
                      fill
                      priority
                      sizes="1"
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-slate-500" />
                  )}
                </div>

                <div>
                  {/* 유저 아이디 */}
                  <p className="text-gray-700 font-bold">
                    {chatRoom?.seller.id === user?.id
                      ? chatRoom?.purchaser.name
                      : chatRoom?.seller.name}
                  </p>
                  {/* 마지막 메시지 */}
                  <p className="text-sm text-gray-500">
                    {chatRoom?.messages.at(-1)?.message}
                  </p>
                </div>
              </div>
              {/* 마지막 채팅 날짜 */}
              <div className="self-start py-2 px-2 text-sm text-gray-400">
                {chatRoom?.messages.at(-1)?.createdAt}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
