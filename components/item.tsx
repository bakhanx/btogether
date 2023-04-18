import Image from "next/image";
import Link from "next/link";

interface ItemProps {
  title: string;
  id: number;
  price: number;
  comments: number;
  hearts: number;
  image: string;
}

export default function Item({
  title,
  id,
  price,
  comments,
  hearts,
  image,
}: ItemProps) {
  return (
    <Link href={`/products/${id}`}>
      <div className="flex cursor-pointer justify-between px-4 py-2">
        {/* title,price */}
        <div className="flex space-x-4">
          {image ? (
            <Image className="h-20 w-20" alt={title} src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${image}/public`} width={128} height={128}  />
          ) : (
            <div className="h-20 w-20 rounded-md bg-gray-400" />
          )}

          <div className="flex flex-col pt-2">
            <span className="text-lg">{title}</span>
            <span>\{price}</span>
          </div>
        </div>

        {/* comments,hearts */}
        <div className="flex items-end justify-end space-x-2">
          <div className="flex items-center space-x-0.5 text-sm text-gray-600">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
            <span>{hearts}</span>
          </div>

          <div className="flex items-center space-x-0.5 text-sm text-gray-600">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
            <span>{comments}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
