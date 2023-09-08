import { Product } from "@prisma/client";

export type SellingType = "selling" | "reserve" | "sold";

export type UserInfo = {
  id: number;
  name: string;
  avatar: string;
};

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

export type ProductResponse = {
  ok: boolean;
  product: ProductDetail;
  relatedProducts: Product[];
  isFavorite: Boolean;
  myChatRoomId: number;
};

export type ProductUploadForm = {
  name: string;
  price: string;
  description: string;
  photo: FileList;
  productId: number;
};

export type ProductUploadMutation = {
  ok: boolean;
  product: Product;
};

export type ProductUploadResponse = {
  ok: boolean;
  product: Product;
  updateProduct: Product;
};
