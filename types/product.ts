import { ChatRoom, Product } from "@prisma/client";

type SellingType = "selling" | "reserve" | "sold";

type UserInfo = {
  id: number;
  name: string;
  avatar: string;
};
// ============= product/index ===================

export interface ProductDetail extends Product {
  sellState: SellingType;
  seller: UserInfo;
  _count: {
    chatRooms: number;
    records: number;
  };
  chatRooms: {
    id: number;
    purchaser: UserInfo;
  }[];
}

export interface ProductResponse {
  ok: boolean;
  product: ProductDetail;
  relatedProducts: Product[];
  isFavorite: Boolean;
  myChatRoomId: number;
}

// ============= product/modify ===================
export interface UploadProductForm {
  name: string;
  price: string;
  description: string;
  photo: FileList;
  productId: number;
}


// ============= product/upload ===================
export interface UploadProductForm {
  name: string;
  price: string;
  description: string;
  photo: FileList;
}

export interface UploadProductMutation {
  ok: boolean;
  product: Product;
}
