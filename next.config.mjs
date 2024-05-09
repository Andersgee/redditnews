import "./src/utils/validate-process-env.mjs";
import { withPlausibleProxy } from "next-plausible";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

//export default withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(nextConfig);
export default withPlausibleProxy()(nextConfig);
