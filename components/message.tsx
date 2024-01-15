import { cls } from "../libs/client/utils";
import Image from "next/image";
import DateTime from "./datetime";

type MessageProps = {
  message: string;
  reversed?: boolean;
  avatar?: string;
  time: Date;
}

export default function Message({
  message,
  reversed,
  avatar,
  time,
}: MessageProps) {
  return (
    <div
      className={cls(
        "flex items-start",
        reversed ? "flex-row-reverse space-x-reverse" : ""
      )}
    >
      <div className="relative h-10 w-10 mx-1">
        {avatar ? (
          <Image
            src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${avatar}/avatar`}
            alt=""
            fill
            priority
            sizes="1"
            className="rounded-full shadow-md"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-slate-500" />
        )}
      </div>

      <div className="max-w-[50%] rounded-md border border-gray-300 p-2 text-sm text-gray-700">
        <p>{message}</p>
      </div>
      <div className="text-gray-400 text-xs self-end mb-1 text-end mx-1">
        <DateTime date={time} time />
      </div>
    </div>
  );
}
