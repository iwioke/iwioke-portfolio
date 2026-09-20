export const siteConfig = {
  name: "Maxim Matsulevich / iwioke",
  email: "iwiokework@gmail.com",
  telegram: "https://t.me/iwiokedamn",
  instagram: "https://www.instagram.com/iwiokebaa/",
  github: "https://github.com/iwioke",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, ""),
} as const;

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return siteConfig.siteUrl ? `${siteConfig.siteUrl}${normalizedPath}` : normalizedPath;
}
