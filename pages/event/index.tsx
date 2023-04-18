import { readFileSync, readdirSync } from "fs";
import { NextPage } from "next";
import matter from "gray-matter";
import Layout from "@components/layout";
import Link from "next/link";

interface EventProps {
  title: string;
  date: string;
  content: string;
  slug: string;
}

const Event: NextPage<{ events: EventProps[] }> = ({ events }) => {
  console.log(events)
  return (
    <Layout canGoBack seoTitle="이벤트" title="이벤트">
      <div className="grid grid-cols-2 gap-x-24 gap-y-8 px-8 py-8">
        {events?.map((event, i) => (
          <Link key={i} href={`/event/${event.slug}`}>
            <div
              key={i}
              className="h-48 rounded-lg border-2 border-blue-300 p-4"
            >
              <div className="text-lg font-bold text-blue-600">
                {event.title}
              </div>
              <div className="my-2 border"></div>
              <div className="pb-1 text-sm font-bold text-gray-500">
                {event.date}
              </div>
              <div>{event.content}</div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export function getStaticProps() {
  const events = readdirSync("./md/event").map((event) => {
    const file = readFileSync(`./md/event/${event}`, "utf-8");
    const [slug, _] = event.split(".");
    return { ...matter(file).data, slug };
  });

  return {
    props: {
      events,
    },
  };
}

export default Event;
