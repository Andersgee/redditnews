import { env } from "./src/env/server.mjs"; //importing this ensures the app isn't built with invalid env vars
import { withPlausibleProxy } from "next-plausible";
import withPWA from "next-pwa";

//next-pwa custom worker example: https://github.com/shadowwalker/next-pwa/tree/master/examples/custom-ts-worker

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return withPWA({ dest: "public" })(withPlausibleProxy()(config));
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
  // Next.js i18n docs: https://nextjs.org/docs/advanced-features/i18n-routing
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
});
