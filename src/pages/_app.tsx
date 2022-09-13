import "../styles/globals.css";
import type { AppType } from "next/dist/shared/lib/utils";
import { ThemeProvider } from "next-themes";
import PlausibleProvider from "next-plausible";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <PlausibleProvider domain="news.andyfx.net">
      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </PlausibleProvider>
  );
};

export default MyApp;
