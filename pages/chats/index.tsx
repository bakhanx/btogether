import DateTime from "@components/datetime";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { ChatRoom } from "@prisma/client";
import { GetServerSideProps, NextPage, NextPageContext } from "next";
import Image from "next/image";
import Link from "next/link";
import useSWR, { SWRConfig } from "swr";
import client from "@libs/server/client";
import { withSsrSession } from "@libs/server/withSession";

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

const ChatRoomsList = () => {
  const { user } = useUser();
  const { data: chatsData, isLoading } =
    useSWR<ChatRoomsResponse>("/api/chats");
  return (
    <>
      {chatsData ? (
        <div className="divide-y-2">
          {chatsData?.chatRooms?.map((chatRoom) => (
            <Link
              href={`/chats/${chatRoom?.id}`}
              key={chatRoom?.id}
              className="block"
            >
              <div className="flex cursor-pointer items-center justify-between">
                <div className="flex items-center space-x-3 px-4 py-3">
                  {/* 유저 아바타 */}
                  <div className="relative aspect-square w-16 rounded-full shadow-md">
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
                        <div className="aspect-square w-16 rounded-full bg-slate-500" />
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
                  <div className="space-y-2">
                    <div>
                      {/* 아이디 */}
                      <span className="font-bold text-gray-700">
                        {chatRoom?.seller.id === user?.id
                          ? chatRoom?.purchaser.name
                          : chatRoom?.seller.name}
                      </span>
                      {/* 시간 */}
                      <span className="self-start py-2 px-2 text-xs text-gray-400">
                        <DateTime
                          date={chatRoom?.messages.at(-1)?.createdAt}
                          timeAgo
                        />
                      </span>
                    </div>

                    {/* 메시지 */}
                    <p className="text-sm text-gray-500">
                      {chatRoom?.messages.at(-1)?.message}
                    </p>
                  </div>
                </div>

                <div className="relative mr-2 aspect-square w-20 shadow-md">
                  {chatRoom?.product?.image ? (
                    <Image
                      src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${chatRoom?.product?.image}/thumbnail`}
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
      ) : (
        "Loading..."
      )}
    </>
  );
};

const Chats: NextPage = () => {
  return (
    <Layout title="채팅" hasTabBar canGoBack seoTitle="채팅">
      <ChatRoomsList />
    </Layout>
  );
};

const Page: NextPage<{ chatRooms: ChatRoomsResponse }> = ({ chatRooms }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/chats": {
            ok: true,
            chatRooms,
          },
        },
      }}
    >
      <Chats />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(
  async ({ req }: NextPageContext) => {
    const chatRooms = await client.chatRoom.findMany({
      where: {
        OR: [
          { sellerId: req?.session?.user?.id },
          { purchaserId: req?.session?.user?.id },
        ],
      },
      include: {
        purchaser: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        product: {
          select: {
            image: true,
          },
        },
      },
    });

    return {
      props: {
        chatRooms: JSON.parse(JSON.stringify(chatRooms)),
      },
    };
  }
);

export default Page;
