import { readFileSync, readdirSync } from "fs";
import matter from "gray-matter";
import { NextPage } from "next";

type InfoProps = {
  name: string;
  address: string;
  ceo: string;
  inquiry: string;
  fax: string;
}

const Information: NextPage<{ infos: InfoProps[] }> = ({ infos }) => {
  return (
    <div>
      {infos?.map((info, i) => (
        <div key={i} className="px-4 py-4">
          <div>상호명 : {info?.name}</div>
          <div>주소 : {info?.address}</div>
          <div>대표 : {info?.ceo}</div>
        </div>
      ))}
    </div>
  );
};

export function getStaticProps() {
  const files = readdirSync(`./md/information`).map((file) => {
    const info = readFileSync(`./md/information/${file}`, "utf-8");
    console.log(matter(info).data);
    return matter(info).data;
  });

  return {
    props: {
      infos: files,
    },
  };
}

export default Information;
