import type {MetadataRoute} from "next";
import {locales} from "@/content";
import {absoluteUrl, siteConfig} from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.siteUrl) return [];

  return locales.map((locale) => ({
    url: absoluteUrl(`/${locale}`),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
    alternates: {languages: {en: absoluteUrl("/en"), ru: absoluteUrl("/ru")}},
  }));
}
