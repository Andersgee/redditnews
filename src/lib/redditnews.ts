import { env } from "src/env/server.mjs";
import { z } from "zod";

/** there is a bunch of things, only grab a few properties*/
const redditPostSchema = z.object({
  created_utc: z.number(),
  domain: z.string(),
  permalink: z.string(),
  score: z.number(),
  title: z.string(),
  url: z.string(),
  selftext: z.string(),
});

const tokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  scope: z.string(),
  token_type: z.string(),
});

const responseSchema = z.object({
  data: z.object({ children: z.array(z.object({ data: redditPostSchema })) }),
});

export type RedditPost = z.infer<typeof redditPostSchema>;

export type Redditnews = {
  worldnews: RedditPost[];
  news: RedditPost[];
};

type Token = z.infer<typeof tokenSchema>;

export async function getRedditnews(): Promise<Redditnews> {
  const res = await fetch(`${TOKEN_BASE_URL}?grant_type=client_credentials`, {
    method: "POST",
    headers: {
      authorization: `Basic ${Buffer.from(`${env.REDDIT_CLIENT_ID}:${env.REDDIT_CLIENT_SECRET}`).toString("base64")}`,
    },
  });
  const token = tokenSchema.parse(await res.json());

  const [news, worldnews] = await Promise.all([getposts("/r/news/hot", token), getposts("/r/worldnews/hot", token)]);
  //const news = await getposts("/r/news/hot", token);
  //const worldnews = await getposts("/r/worldnews/hot", token);
  return { news, worldnews };
}

const TOKEN_BASE_URL = "https://www.reddit.com/api/v1/access_token";
const API_BASE_URL = "https://oauth.reddit.com";

async function getposts(path: string, token: Token, limit = 8): Promise<RedditPost[]> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Authorization: `${token.token_type} ${token.access_token}` },
  });
  const json = responseSchema.parse(await res.json());

  const posts = json.data.children.map((child) => ({
    created_utc: child.data.created_utc,
    domain: child.data.domain,
    permalink: child.data.permalink,
    score: child.data.score,
    selftext: child.data.selftext,
    title: child.data.title,
    url: child.data.url,
  }));

  return posts.slice(0, limit);
}
