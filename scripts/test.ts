import "dotenv/config";
import { z } from "zod";

async function getToken() {
  const authorization = `Basic ${Buffer.from(
    `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`,
  ).toString("base64")}`;
  const token = z
    .object({
      access_token: z.string(),
      expires_in: z.number(),
      scope: z.string(),
      token_type: z.string(),
    })
    .parse(
      await fetch("https://www.reddit.com/api/v1/access_token?grant_type=client_credentials", {
        method: "POST",
        headers: { authorization },
      }).then((r) => r.json()),
    );
  console.log("token:", token);

  return `${token.token_type} ${token.access_token}`;
}

async function main() {
  //const t = await getToken();
  const t = `Basic ${Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString(
    "base64",
  )}`;

  const r = await fetch("https://oauth.reddit.com/r/worldnews/hot.json", {
    headers: {
      Authorization: t,
      //"User-Agent": "andy_redditbot",
    },
  });
  console.log(r);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const d = await r.json();
  console.log(d);
}

void main();
