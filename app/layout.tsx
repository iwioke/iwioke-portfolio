import type {Metadata} from "next";
import "./globals.css";
import {siteConfig} from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: siteConfig.siteUrl ? new URL(siteConfig.siteUrl) : undefined,
  applicationName: "Maxim Matsulevich / iwioke",
  authors: [{name: "Maxim Matsulevich"}],
  creator: "Maxim Matsulevich",
  robots: {index: true, follow: true},
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return children;
}
