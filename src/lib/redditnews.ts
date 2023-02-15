import { env } from "src/env/server.mjs";

export type RedditPost = {
  domain: string;
  score: number;
  title: string;
  permalink: string;
  url: string;
  selftext: string;
  created_utc: string;
};

export type Redditnews = {
  worldnews: RedditPost[];
  news: RedditPost[];
};

export async function getRedditnews(): Promise<Redditnews> {
  const token: Token = await fetch(`${TOKEN_BASE_URL}?grant_type=client_credentials`, {
    method: "POST",
    headers: {
      authorization: `Basic ${Buffer.from(`${env.REDDIT_CLIENT_ID}:${env.REDDIT_CLIENT_SECRET}`).toString("base64")}`,
    },
  }).then((res) => res.json());

  const [news, worldnews] = await Promise.all([getposts("/r/news/hot", token), getposts("/r/worldnews/hot", token)]);
  //const news = await getposts("/r/news/hot", token);
  //const worldnews = await getposts("/r/worldnews/hot", token);
  return { news, worldnews };
}

const TOKEN_BASE_URL = "https://www.reddit.com/api/v1/access_token";
const API_BASE_URL = "https://oauth.reddit.com";

type Token = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
};

async function getposts(path: string, token: Token, limit = 8): Promise<RedditPost[]> {
  const json = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Authorization: `${token.token_type} ${token.access_token}` },
  }).then((res) => res.json());

  //we dont need entire data. grab a few things
  if (json?.kind === "Listing") {
    return json.data.children
      .map((child: { data: RedditPost }) => ({
        created_utc: child.data.created_utc,
        domain: child.data.domain,
        permalink: child.data.permalink,
        score: child.data.score,
        selftext: child.data.selftext,
        title: child.data.title,
        url: child.data.url,
      }))
      .slice(0, limit);
  } else {
    return [];
  }
}
