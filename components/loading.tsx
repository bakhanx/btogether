import Image from "next/image";
import Loader from "../public/Spinner.svg";

export default function Loading() {
  return (
    <div className="fixed w-full max-w-screen-lg flex justify-center pt-28 z-50">
      <Image src={Loader} alt="" priority width={80} height={80}></Image>
    </div>
  );
}
