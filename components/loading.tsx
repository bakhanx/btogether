import Image from "next/image";
import Loader from "../public/Spinner.svg";

export default function Loading() {
  return (
    <div className="flex justify-center pt-5 z-50">
      <Image src={Loader} alt="" width={80} height={80}></Image>
    </div>
  );
}
