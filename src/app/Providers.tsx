"use client";

import PlausibleProvider from "next-plausible";
import { useEffect } from "react";
import { registerSw } from "../lib/sw";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void registerSw();
  }, []);

  return <PlausibleProvider domain="news.andyfx.net">{children}</PlausibleProvider>;
}
