import "./globals.css";
import { Providers } from "./Providers";
import { seo } from "src/utils/seo";

export const metadata = seo({
  title: "Simple Reddit News",
  description: "Simple overview of latest /r/news and /r/worldnews.",
  url: "/",
  image: "/icons/favicon-192.png",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
