import { NextPage } from "next";
import Button from "../../components/button";
import Layout from "../../components/layout";
import TextArea from "../../components/textarea";

const Write: NextPage = () => {
  return (
    <Layout canGoBack title="소식 쓰기">
      <form className="space-y-4 p-4">
        <TextArea required placeholder="내 소식을 작성하세요!" />
        <Button text="submit" />
      </form>
    </Layout>
  );
};

export default Write;
