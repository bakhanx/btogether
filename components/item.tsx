import Image from "next/image";
import Link from "next/link";
import DateTime from "./datetime";
import SellStateLabel from "./sellStateLabel";
import { SellingType } from "types/product";

type ItemProps = {
  title: string;
  id: number;
  time: Date;
  price: number;
  comments: number;
  hearts: number;
  image: string;
  sellState: SellingType;
}

export default function Item({
  title,
  id,
  price,
  comments,
  hearts,
  image,
  time,
  sellState,
}: ItemProps) {
  return (
    <Link href={`/product/${id}`}>
      <div className="cursor-pointer justify-between px-4 py-2 hover:bg-slate-50">
        {/* title,price */}
        <div className="flex space-x-4">
          {image ? (
            <div className="relative aspect-square w-40">
              <Image
                className="rounded-md object-cover"
                fill
                quality={90}
                sizes="1"
                priority={true}
                alt={title}
                style={{objectFit:"cover"}}
                src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${image}/thumbnail`}
              />
            </div>
          ) : (
            <div className="h-20 w-20 rounded-md bg-gray-500" />
          )}

          <div className="flex w-full flex-col justify-between truncate ">
            <div className="flex flex-col">
              <div className="flex items-center">
                <SellStateLabel sellState={sellState} hideSelling />
                <span className="truncate text-lg ">{title}</span>
              </div>
              <span className="truncate pt-1 text-sm text-gray-500">
                <DateTime date={time} timeAgo />
              </span>
              <span className="pt-1 text-sm font-medium">
                {price.toLocaleString()}원
              </span>
            </div>
            {/* 댓글, 좋아요 */}
            <div>
              <div className="flex items-end justify-end space-x-2">
                {/* 댓글 */}
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
                {/* 좋아요 */}
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
          </div>
        </div>
      </div>
    </Link>
  );
}
