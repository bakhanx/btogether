import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { ChatRoom } from "@prisma/client";
import { NextPage } from "next";
import Link from "next/link";
import useSWR from "swr";

// 상대 user 의 아바타, 아이디, 채팅내용.

interface ChatRoomWithUsers extends ChatRoom {
  purchaser: {
    id: number;
    name: string;
  };
  seller: {
    id: number;
    name: string;
  };
  product: {
    name: string;
  };
  messages : any;
}
export interface ChatRoomsResponse {
  ok: boolean;
  chatRooms: ChatRoomWithUsers[];
}



const Chats: NextPage = () => {
  const { data } = useSWR<ChatRoomsResponse>("/api/chats");
  const { user } = useUser();
  return (
    <Layout title="채팅" hasTabBar seoTitle="채팅">
      <div className="divide-y-2">
        <div className="p-5 text-center text-2xl text-red-500">구현중</div>
        {data?.chatRooms?.map((chatRoom) => (
          <Link
            href={`/chats/${chatRoom?.id}`}
            key={chatRoom?.id}
            className="block"
          >
            <div className="flex cursor-pointer items-center space-x-3 px-4 py-3">
              <div className="h-12 w-12 rounded-full bg-slate-300" />
              <div>
                <p className="text-gray-700">
                  {chatRoom?.seller.id === user?.id
                    ? chatRoom?.purchaser.name
                    : chatRoom?.seller.name}
                </p>
                
                <p className="text-sm text-gray-500">{chatRoom?.messages.at(-1)?.message}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
