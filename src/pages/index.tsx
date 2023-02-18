import type { GetStaticProps } from "next";
import { useEffect } from "react";
import { SEO } from "src/components/SEO";
import { getRedditnews, type Redditnews, type RedditPost } from "src/lib/redditnews";
import * as sw from "src/lib/sw";

type Props = {
  redditnews: Redditnews;
};

export default function Page({ redditnews }: Props) {
  useEffect(() => {
    sw.unregister();
  }, []);

  return (
    <>
      <SEO
        title="Simple Reddit News"
        description="Simple overview of reddit news."
        url="https://news.andyfx.net"
        image="/icons/andyfx-192x192.png"
      />
      <main className="container mx-auto mt-4 mb-8">
        <div className="px-2 lg:grid lg:grid-cols-2 lg:gap-4">
          <div>
            <h2 className="text-xl ml-2 tracking-wider">/r/worldnews</h2>
            {redditnews.worldnews.map((post) => (
              <Post key={post.permalink} post={post} />
            ))}
          </div>
          <div>
            <h2 className="text-xl ml-2 tracking-wider">/r/news</h2>
            {redditnews.news.map((post) => (
              <Post key={post.permalink} post={post} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

function Post({ post }: { post: RedditPost }) {
  return (
    <div className="p-2">
      <h3 className="text-base font-normal">{post.title}</h3>
      <p>
        {`score: ${scoreformat(post.score)}, source: ${post.domain}, `}
        <a className="hover:text-blue-500" href={`https://www.reddit.com${post.permalink}`}>
          view on reddit
        </a>
      </p>
    </div>
  );
}

function roundn(x: number, n = 0) {
  const k = Math.pow(10, n);
  return Math.round((x + Number.EPSILON) * k) / k;
}

function scoreformat(score: number) {
  if (score > 1000) {
    return `${roundn(score / 1000, 1)}k`;
  } else {
    return `${score}`;
  }
}

///////////////////

export const getStaticProps: GetStaticProps = async () => {
  try {
    const redditnews = await getRedditnews();
    const props: Props = { redditnews };
    return {
      props,
      revalidate: 60 * 60, //in seconds
    };
  } catch (error) {
    throw new Error("Failed to fetch posts");
  }
};
