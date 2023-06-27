import Image from "next/image";
import Loader from "../public/Spinner.svg";

export default function Loading() {
  return (
    <div className="mt-10 flex justify-center">
      <Image src={Loader} alt="" width={80} height={80}></Image>
    </div>
  );
}
