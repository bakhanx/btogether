import Image from "next/image";
import Loader from "../public/Spinner.svg";

export default function Loading() {
  return (
    <div className=" w-full max-w-screen-md flex justify-center pt-28 z-50">
      <Image src={Loader} priority={true} alt="" width={80} height={80}></Image>
    </div>
  );
}
