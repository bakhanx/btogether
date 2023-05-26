import DateTime from "@components/datetime";
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
            <div className="flex cursor-pointer justify-between items-center">
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

                {/* 유저 아이디 + 시간 + 메시지 */}
                <div>
                  <div>
                    {/* 아이디 */}
                    <span className="font-bold text-gray-700">
                      {chatRoom?.seller.id === user?.id
                        ? chatRoom?.purchaser.name
                        : chatRoom?.seller.name}
                    </span>
                    {/* 시간 */}
                    <span className="self-start py-2 px-2 text-xs text-gray-400">
                      <DateTime date={chatRoom?.messages.at(-1)?.createdAt} />
                    </span>
                  </div>
                  {/* 메시지 */}
                  <p className="text-sm text-gray-500">
                    {chatRoom?.messages.at(-1)?.message}
                  </p>
                </div>
              </div>
              <div className="relative h-14 w-14 mr-2">
                {chatRoom?.product?.image ? (
                  <Image
                    src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${chatRoom?.product?.image}/public`}
                    alt=""
                    fill
                    priority
                    sizes="1"
                    className="rounded-md"
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
