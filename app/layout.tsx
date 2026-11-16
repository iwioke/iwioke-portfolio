import type {Metadata, Viewport} from "next";
import {Onest, Unbounded} from "next/font/google";
import "./globals.css";
import {site} from "@/content/site";
import {absoluteUrl, siteUrl} from "@/lib/site";

const unbounded = Unbounded({subsets: ["latin"], weight: ["500", "700", "800"], variable: "--font-unbounded", display: "swap"});
const onest = Onest({subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-onest", display: "swap"});

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: site.title,
  description: site.description,
  applicationName: "iwioke",
  authors: [{name: site.name}],
  creator: site.name,
  robots: {index: true, follow: true},
  alternates: siteUrl ? {canonical: "/"} : undefined,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "iwioke",
    title: site.title,
    description: site.description,
    ...(siteUrl ? {url: absoluteUrl("/"), images: [{url: absoluteUrl("/og.jpg"), width: 1200, height: 630, alt: "iwioke — portfolio of Maxim Matsulevich"}]} : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    ...(siteUrl ? {images: [absoluteUrl("/og.jpg")]} : {}),
  },
};

export const viewport: Viewport = {themeColor: "#05060a", colorScheme: "dark"};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${unbounded.variable} ${onest.variable}`}>
      <body>
        <noscript>
          <style>{".ui{opacity:1!important}.loader{display:none}"}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
