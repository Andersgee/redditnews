import "./globals.css";
import { Providers } from "./Providers";
import { seo } from "src/utils/seo";

export const metadata = seo({
  title: "News",
  description: "Quickly find/plan stuff to do with friends, or with anyone really.",
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
