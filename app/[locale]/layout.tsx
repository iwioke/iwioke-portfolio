import type {Metadata} from "next";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {notFound} from "next/navigation";
import {content, isLocale, locales} from "@/content";
import {absoluteUrl, siteConfig} from "@/lib/site";

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>;

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: Omit<LocaleLayoutProps, "children">): Promise<Metadata> {
  const {locale: localeParam} = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam;
  const copy = content[locale];
  const canonical = `/${locale}`;
  const socialImage = siteConfig.siteUrl
    ? {url: absoluteUrl("/images/lm-group/billboard.jpg"), width: 2200, height: 1467, alt: "LM Group identity"}
    : undefined;

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    alternates: {
      canonical,
      languages: {en: "/en", ru: "/ru", "x-default": "/en"},
    },
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "ru_RU",
      title: copy.metadata.title,
      description: copy.metadata.description,
      siteName: "Maxim Matsulevich / iwioke",
      ...(siteConfig.siteUrl ? {url: absoluteUrl(canonical)} : {}),
      ...(socialImage ? {images: [socialImage]} : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: copy.metadata.title,
      description: copy.metadata.description,
      ...(socialImage ? {images: [socialImage.url]} : {}),
    },
  };
}

export default async function LocaleLayout({children, params}: LocaleLayoutProps) {
  const {locale: localeParam} = await params;
  if (!isLocale(localeParam)) notFound();
  const messages = await getMessages();

  return (
    <html lang={localeParam} data-scroll-behavior="smooth">
      <body>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
