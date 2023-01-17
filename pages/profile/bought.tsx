import { NextPage } from "next";
import Item from "../../components/item";
import Layout from "../../components/layout";

const Bought: NextPage = () => {
  return (
    <Layout title="판매내역" canGoBack hasTabBar>
      <div className=" flex flex-col space-y-2 divide-y py-2">
        {[1, 1, 1, 1, 1].map((_, i) => (
          <Item
            key={i}
            id={i}
            title="치킨 팝니다"
            price={3000}
            comments={i}
            hearts={i}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Bought;
