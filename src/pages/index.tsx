import type { NextPage, GetStaticProps } from "next";
import { Head } from "src/components/Head";
import { env } from "src/env/server.mjs";
//import { ThemeToggleButton } from "src/components/ThemeToggleButton";

type Post = {
  domain: string;
  score: number;
  title: string;
  permalink: string;
  url: string;
  selftext: string;
  created_utc: string;
};

type Redditnews = {
  worldnews: Post[];
  news: Post[];
};

type Props = {
  redditnews: Redditnews;
};

const Home: NextPage<Props> = ({ redditnews }) => {
  return (
    <>
      <Head
        title="Simple Reddit News"
        description="Simple overview of reddit news"
        domainUrl="https://news.andyfx.net"
        url="https://news.andyfx.net"
      />

      {/*<ThemeToggleButton />*/}
      <main className="flex justify-center mt-4 mb-8">
        <div className="container lg:grid lg:grid-cols-2 lg:gap-4">
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
};

export default Home;

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

const Post = ({ post }: { post: Post }) => {
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
};

///////////////////////////////////////

const TOKEN_BASE_URL = "https://www.reddit.com/api/v1/access_token";
const API_BASE_URL = "https://oauth.reddit.com";

const clientId = env.REDDIT_CLIENT_ID;
const clientSecret = env.REDDIT_CLIENT_SECRET;

type Token = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
};

async function getposts(path: string, token: Token): Promise<Post[]> {
  const json = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Authorization: `${token.token_type} ${token.access_token}` },
  }).then((res) => res.json());

  //we dont need entire data. grab a few things
  if (json?.kind === "Listing") {
    return json.data.children
      .map((child: { data: Post }) => ({
        created_utc: child.data.created_utc,
        domain: child.data.domain,
        permalink: child.data.permalink,
        score: child.data.score,
        selftext: child.data.selftext,
        title: child.data.title,
        url: child.data.url,
      }))
      .slice(0, 8);
  } else {
    return [];
  }
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const token: Token = await fetch(`${TOKEN_BASE_URL}?grant_type=client_credentials`, {
      method: "POST",
      headers: {
        authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
    }).then((res) => res.json());

    const news = await getposts("/r/news/hot", token);
    const worldnews = await getposts("/r/worldnews/hot", token);
    const redditnews = { news, worldnews };

    const props: Props = { redditnews };
    return {
      props,
      revalidate: 10, //at most once every 10 seconds
    };
  } catch (error) {
    //https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#error-handling-and-revalidation
    // If there is a server error, you might want to
    // throw an error instead of returning so that the cache is not updated
    // until the next successful request.
    throw new Error("Failed to fetch posts");

    //return { notFound: true };
  }
};
