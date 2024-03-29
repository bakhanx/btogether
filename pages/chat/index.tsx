import DateTime from "@components/datetime";
import Layout from "@components/layout";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import useSWR, { SWRConfig } from "swr";
import { Suspense, useEffect, useState } from "react";
import Loading from "@components/loading";
import { ChatRoomListResponse } from "types/chat";
import { UserResponse } from "types/user";
import ScrollToTopButton from "@components/scrollToTopButton";

// 상대 user 의 아바타, 아이디, 채팅내용.

const ChatRoomsList = () => {
  // const { user } = useUser();
  const { data: userData } = useSWR<UserResponse>(`/api/users/me`);
  const { data: chatsData, isLoading } =
    useSWR<ChatRoomListResponse>("/api/chats");
  const [roomName, setRoomName] = useState("");

  useEffect(() => {});

  return (
    <>
      {chatsData ? (
        <div className="divide-y-4 divide-gray-100">
          {chatsData?.chatRooms?.map((chatRoom) => (
            <Link
              href={`/chat/${chatRoom?.id}`}
              key={chatRoom?.id}
              className="block hover:bg-gray-50"
            >
              <div className="flex cursor-pointer items-center justify-between">
                <div className="flex items-center space-x-3 px-4 py-4">
                  {/* 유저 아바타 */}
                  <div className="relative aspect-square w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-md">
                    {userData?.profile?.id === chatRoom.purchaserId ? (
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
                      <div className="h-16 w-16 rounded-full bg-slate-500" />
                    )}
                  </div>

                  {/* 유저 아이디 + 시간 + 메시지 */}
                  <div className="space-y-2 ">
                    <div>
                      {/* 아이디 */}
                      <span className="font-bold text-gray-700">
                        {chatRoom?.seller.id === userData?.profile?.id
                          ? chatRoom?.purchaser.name
                          : chatRoom?.seller.name}
                      </span>
                      {/* 시간 */}
                      <span className="self-start py-2 px-2 text-xs text-gray-500">
                        <DateTime
                          date={chatRoom?.messages.at(-1)?.updatedAt}
                          timeAgo
                        />
                      </span>
                    </div>

                    {/* 메시지 */}
                    <div className="text-sm text-gray-500 line-clamp-1 ">
                      {chatRoom?.messages.at(-1)?.message}
                    </div>
                  </div>
                </div>

                <div className="relative mr-2 aspect-square sm:w-20 sm:h-20 w-16 h-16 shadow-md">
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
        <div className="text-center">Loading...</div>
      )}
      <ScrollToTopButton hasBottomTab />
    </>
  );
};

const Chat: NextPage = () => {
  return (
    <Layout title="채팅" hasTabBar seoTitle="채팅" pathName="Chat">
      <Suspense fallback={<Loading />}>
        <ChatRoomsList />
      </Suspense>
    </Layout>
  );
};

const Page: NextPage = () => {
  return (
    <SWRConfig value={{ suspense: true }}>
      <Chat />
    </SWRConfig>
  );
};

// export const getServerSideProps = withSsrSession(
//   async ({ req }: NextPageContext) => {
//     const chatRooms = await client.chatRoom.findMany({
//       where: {
//         OR: [
//           { sellerId: req?.session?.user?.id },
//           { purchaserId: req?.session?.user?.id },
//         ],
//       },
//       include: {
//         purchaser: {
//           select: {
//             id: true,
//             name: true,
//             avatar: true,
//           },
//         },
//         seller: {
//           select: {
//             id: true,
//             name: true,
//             avatar: true,
//           },
//         },
//         messages: {
//           orderBy: { createdAt: "desc" },
//           take: 1,
//         },
//         product: {
//           select: {
//             image: true,
//           },
//         },
//       },
//     });

//     const profile = await client.user.findUnique({
//       where: {
//         id: Number(req?.session?.user?.id),
//       },
//       select: {
//         id: true,
//       },
//     });

//     return {
//       props: {
//         chatRooms: JSON.parse(JSON.stringify(chatRooms)),
//         profile: JSON.parse(JSON.stringify(profile)),
//       },
//       Suspense:true
//     };
//   }
// );

export default Page;
