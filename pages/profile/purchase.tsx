import { NextPage } from "next";
import Layout from "@components/layout";
import MyProductList from "@components/myProductList";
import { Suspense, useState } from "react";
import Loading from "@components/loading";
import { cls } from "@libs/client/utils";

const Purchase: NextPage = () => {
  const [kind, setKind] = useState<"Product" | "Free">("Product");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (kind === "Product") {
      setKind("Free");
    } else {
      setKind("Product");
    }
  };

  return (
    <Layout
      title="구매내역"
      seoTitle="내 구매내역"
      canGoBack
      hasTabBar
      pathName="Profile"
    >
      <Suspense fallback={<Loading />}>
        <div className="p-4 text-sm">
          <span className="">
            <button
              className={cls(
                kind === "Product"
                  ? "bg-gradient-to-tr from-blue-600  to-purple-500 text-white drop-shadow-lg  border-blue-800"
                  : "cursor-pointer bg-gray-200 ",
                "p-2 rounded-tl-sm rounded-bl-sm border-b-4"
              )}
              onClick={handleClick}
              disabled={kind === "Product" && true}
            >
              판매
            </button>

            <button
              className={cls(
                kind === "Free"
                  ? "bg-gradient-to-tr from-orange-600 via-orange-600 to-yellow-400 text-white drop-shadow-lg  border-orange-700"
                  : "cursor-pointer bg-gray-200",
                "p-2 rounded-tr-sm rounded-br-sm  border-b-4"
              )}
              onClick={handleClick}
              disabled={kind === "Free" && true}
            >
              나눔
            </button>
          </span>
        </div>

        <div className={kind === "Free" ? "hidden" : ""}>
          <MyProductList kind="Purchase" category={"Product"} />
        </div>
        <div className={kind === "Product" ? "hidden" : ""}>
          <MyProductList kind="Purchase" category={"Free"} />
        </div>
      </Suspense>
    </Layout>
  );
};

export default Purchase;
