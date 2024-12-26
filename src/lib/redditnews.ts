import { z } from "zod";

/** there is a bunch of things, only grab a few properties*/
const zRedditPost = z.object({
  created_utc: z.number(),
  domain: z.string(),
  permalink: z.string(),
  score: z.number(),
  title: z.string(),
  url: z.string(),
  selftext: z.string(),
});

const zResponse = z.object({
  data: z.object({ children: z.array(z.object({ data: zRedditPost })) }),
});

export type RedditPost = z.infer<typeof zRedditPost>;

export type Redditnews = {
  worldnews: RedditPost[];
  news: RedditPost[];
  date: Date;
};

export async function getRedditnews(): Promise<Redditnews> {
  const [news, worldnews] = await Promise.all([getposts("/r/news/hot.json"), getposts("/r/worldnews/hot.json")]);
  const date = new Date();
  //const news = await getposts("/r/news/hot", token);
  //const worldnews = await getposts("/r/worldnews/hot", token);
  return { news, worldnews, date };
}

const API_BASE_URL = "https://oauth.reddit.com";
const TOKEN = `Basic ${Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString(
  "base64",
)}`;

async function getposts(path: string, limit = 8): Promise<RedditPost[]> {
  const json = zResponse.parse(
    await fetch(`${API_BASE_URL}${path}`, {
      headers: { Authorization: TOKEN },
    }).then((r) => r.json()),
  );

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
