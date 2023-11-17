import { readFileSync, readdirSync } from "fs";
import matter from "gray-matter";
import { NextPage } from "next";
import Link from "next/link";

type InfoProps = {
  name: string;
  address: string;
  ceo: string;
  inquiry: string;
  fax: string;
};

const Information: NextPage<{ infos: InfoProps[] }> = ({ infos }) => {
  return (
    <div>
      {infos?.map((info, i) => (
        <div key={i} className="px-4 py-4">
          <div className="font-semibold">
            상호명 :<span className="font-normal">{info?.name}</span>
          </div>
          <div className="font-semibold">
            주소 : <Link href={info?.address}><span className="font-normal">{info?.address}</span></Link>
          </div>
          <div className="font-semibold">
            대표 :<span className="font-normal">{info?.ceo}</span>
          </div>
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
