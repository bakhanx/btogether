import type { NextPage } from "next";
import Button from "../../components/button";
import Input from "../../components/input";
import Layout from "../../components/layout";
import TextArea from "../../components/textarea";

const Upload: NextPage = () => {
  return (
    <Layout canGoBack title="Upload Product">
      <form className="p-4 space-y-4">
        <div>
          <label className="w-full cursor-pointer text-gray-600 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
            <svg
              className="h-12 w-12"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input className="hidden" type="file" />
          </label>
        </div>
        <Input required label="제목" name="name" type="text" placeholder="필수 입력" />
        <Input
          required
          label="가격 (선택사항)"
          placeholder="0"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea name="description" label="내용" placeholder="공지사항 위반 내용 기입 시, 삭제 처리될 수 있습니다." />
        <Button text="Upload item" />
      </form>
    </Layout>
  );
};

export default Upload;