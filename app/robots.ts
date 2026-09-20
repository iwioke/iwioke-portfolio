import type {MetadataRoute} from "next";
import {absoluteUrl, siteConfig} from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {userAgent: "*", allow: "/"},
    ...(siteConfig.siteUrl ? {sitemap: absoluteUrl("/sitemap.xml")} : {}),
  };
}
