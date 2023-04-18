import { readdirSync } from "fs";
import { GetStaticProps, NextPage, NextPageContext } from "next";
import matter from "gray-matter";
import Layout from "@components/layout";
import { unified } from "unified";
import remarkParse from "remark-parse/lib";
import remarkHtml from "remark-html";

const DetailEvent: NextPage<{ content: string; data: any }> = ({
  content,
  data,
}) => {
  return (
    <Layout canGoBack seoTitle="이벤트" title={`[이벤트] ${data.title}`}>
      <div className="flex justify-center px-4 py-4 text-center">
        <div
          className="markdown"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </Layout>
  );
};

export function getStaticPaths() {

  const files = readdirSync("./md/event").map((file) => {
    const [name, _] = file.split(".");
    return { params: { slug: name } };
  });

  return {
    paths: files,
    fallback: false,
  };

  // return {
  //   paths: [],
  //   fallback: "blocking",
  // };
}

export const getStaticProps: GetStaticProps = async (context: any) => {
  const { slug } = context.params;

  const { data, content } = matter.read(`./md/event/${slug}.md`);
  const { value } = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(content);
  console.log(data, content);
  console.log(value);

  return {
    props: {
      content: value,
      data,
    },
  };
};

export default DetailEvent;
