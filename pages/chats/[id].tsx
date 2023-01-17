import { NextPage } from "next";
import Layout from "../../components/layout";
import Message from "../../components/message";

const ChatDetail: NextPage = () => {
  return (
    <Layout title="판매왕김스프" canGoBack>
      <div className="space-y-4 py-10 px-4 pb-16">
        
        {/* 메시지 */}
        <Message message="안녕하세요" />
        <Message reversed message="네 안녕하세요" />
        <Message message="몇시에 가능하세요?" />

        {/* 메시지 입력 칸 */}
        <form className="fixed inset-x-0 bottom-0 bg-white py-5">
          <div className="relative mx-auto flex w-full max-w-md items-center">
            <input
              type="text"
              className="w-full rounded-full border border-gray-300 pl-3  p-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-2 flex py-1.5">
              <button className="flex items-center rounded-full bg-blue-400 px-5 text-lg font-bold text-white focus:ring-2 focus:ring-blue-50 focus:ring-offset-2 ">
                &rarr;
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChatDetail;
