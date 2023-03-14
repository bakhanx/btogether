import { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";

const Chats: NextPage = () => {
  return (
    <Layout title="채팅" hasTabBar>
      <div className="divide-y-2">
        {[1, 1, 1, 1, 1, 1].map((_, i) => (
          <Link href={`/chats/${i}`} key={i} className="block">
            <div className="flex cursor-pointer items-center space-x-3 px-4 py-3">
              <div className="h-12 w-12 rounded-full bg-slate-300" />
              <div>
                <p className="text-gray-700">판매왕김스프</p>
                <p className="text-sm  text-gray-500">몇시에 가능하세요?</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
