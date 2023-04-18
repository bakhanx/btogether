import { Product } from "@prisma/client";
import useSWR, { SWRConfig } from "swr";
import Item from "./item";

interface ProductProps {
  kind: "favorites" | "sales" | "purchases";
}

interface ProductResponse {
  [key: string]: Record[];
}
interface Record {
  id: number;
  product: ProductWithCount;
}
interface ProductWithCount extends Product {
  _count: {
    favorites: number;
    comments: number;
  };
}

const ProductList = ({ kind }: ProductProps) => {
  const { data, isLoading } = useSWR<ProductResponse>(`/api/users/me/${kind}`);
  console.log(data ? data.ok : null);
  return data ? (
    <>
      {data?.[kind].map((record: Record) => (
        <Item
          key={record?.product.id}
          id={record?.product.id}
          title={record?.product.name}
          price={record?.product.price}
          image={record?.product.image}
          hearts={record?.product._count.favorites}
          comments={1}
        />
      ))}
    </>
  ) : null;
}

export default ProductList