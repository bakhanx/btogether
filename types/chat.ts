import { ChatRoom } from "@prisma/client";
import { UserInfo } from "./product";

export interface ChatRoomWithUsers extends ChatRoom {
  purchaser: UserInfo;
  seller: UserInfo;
  product: {
    name: string;
    price: number;
    image: string;
    sellState: string;
  };
  messages: any;
}

export type ChatRoomResponse = {
  ok: boolean;
  chatRoom: ChatRoomWithUsers;
};

export type ChatRoomListResponse = {
  ok: boolean;
  chatRooms: ChatRoomWithUsers[];
};
