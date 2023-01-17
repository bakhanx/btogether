import { NextPage } from "next";
import Item from "../../components/item";
import Layout from "../../components/layout";

const Loved: NextPage = () => {
  return (
    <Layout title="찜하기" canGoBack hasTabBar>
      <div className=" flex flex-col space-y-2 divide-y py-2">
        {[1, 1, 1, 1, 1,1,1].map((_, i) => (
          <Item
            key={i}
            id={i}
            title="샴푸 3개 n빵하실분"
            price={27000}
            comments={i}
            hearts={i}
          />
        ))}
      </div>
    </Layout>
  );
};
export default Loved;
