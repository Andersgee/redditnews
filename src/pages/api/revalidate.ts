import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "src/env/server.mjs";

//https://<your-site.com>/api/revalidate?secret=<token>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { secret } = req.query;

  if (secret !== env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    await res.revalidate("/");
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send("Error revalidating");
  }
}
