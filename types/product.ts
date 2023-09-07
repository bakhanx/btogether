import { Product } from "@prisma/client";

export type SellingType = "selling" | "reserve" | "sold";

export type UserInfo = {
  id: number;
  name: string;
  avatar: string;
};

export type UploadProductForm ={
  name: string;
  price: string;
  description: string;
  photo: FileList;
  productId: number;
}


export type UploadProductMutation = {
  ok: boolean;
  product: Product;
}
