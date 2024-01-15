import Image from "next/image";
import Loader from "../public/Spinner.svg";

export default function Loading({ onOverlay = false }) {
  return (
    <>
      <div className="fixed w-full h-full flex justify-center items-center z-50 left-0 top-0">
        <Image
          src={Loader}
          priority={true}
          alt=""
          width={80}
          height={80}
        ></Image>
      </div>
      {onOverlay && (
        <div className="fixed flex w-full h-full bg-black opacity-60 top-0 left-0 z-40" />
      )}
    </>
  );
}
