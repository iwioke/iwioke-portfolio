import type {MetadataRoute} from "next";
import {absoluteUrl, siteUrl} from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  return [{url: absoluteUrl("/"), lastModified: new Date(), changeFrequency: "monthly", priority: 1}];
}
