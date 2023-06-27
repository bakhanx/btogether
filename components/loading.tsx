import Image from "next/image";
import Spinner from "../public/loadingDuck.gif";

export default function Loading() {
  return (
    <div className="flex justify-center">
      <div>
        <Image src={Spinner} alt="" width={80} height={80}></Image>
      </div>
    </div>
  );
}
