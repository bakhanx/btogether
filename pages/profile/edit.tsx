import { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";

const EditProfile: NextPage = () => {
  return (
    <Layout hasTabBar canGoBack title="프로필 편집">
      <form className="space-y-4 py-10 px-4">
        <div className="flex items-center space-x-3">
          <div className="h-14 w-14 rounded-full bg-slate-500" />
          <label
            htmlFor="picture"
            className="cursor-pointer rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            변경하기
            <input
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input label="이메일 주소" name="email" type="email" required />
        <Button text="프로필 수정" />
      </form>
    </Layout>
  );
};

export default EditProfile;
