import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { NextPage } from "next";
import Link from "next/link";
import { ChatRoomResponse } from "pages/products/[id]";
import useSWR from "swr";

// 상대 user 의 아바타, 아이디, 채팅내용.



const Chats: NextPage = () => {

  const { data } = useSWR<ChatRoomResponse>("/api/chats");
  const {user} = useUser();

  return (
    <Layout title="채팅" hasTabBar seoTitle="채팅">
      <div className="divide-y-2">
        <div className="p-5 text-center text-2xl text-red-500">구현중</div>
        {data?.chats.map((chat) => (
          <Link href={`/chats/${chat.productId}/${chat.purchaser.name}`} key={chat.id} className="block">
            <div className="flex cursor-pointer items-center space-x-3 px-4 py-3">
              <div className="h-12 w-12 rounded-full bg-slate-300" />
              <div>
                <p className="text-gray-700">{chat.seller.id === user?.id ? chat.purchaser.name : chat.seller.name }</p>
                <p className="text-sm  text-gray-500">{chat?.messages}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
