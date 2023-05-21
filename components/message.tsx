import { DiffieHellmanGroup } from "crypto";
import { cls } from "../libs/client/utils";
import Image from "next/image";

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatar?: string;
}

export default function Message({ message, reversed, avatar }: MessageProps) {
  return (
    <div
      className={cls(
        "flex items-start",
        reversed ? "flex-row-reverse space-x-2 space-x-reverse" : "space-x-2"
      )}
    >
      <div className="relative h-10 w-10">
        {avatar ? (
          <Image
            src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${avatar}/avatar`}
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

      <div className="w-1/3 rounded-md border border-gray-300 p-2 text-sm text-gray-700">
        <p>{message}</p>
      </div>
    </div>
  );
}
