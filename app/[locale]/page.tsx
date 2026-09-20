import {About} from "@/components/sections/about";
import {Archive} from "@/components/sections/archive";
import {Capabilities} from "@/components/sections/capabilities";
import {Contact} from "@/components/sections/contact";
import {FeaturedWork} from "@/components/sections/featured-work";
import {Hero} from "@/components/sections/hero";
import {VpnProject} from "@/components/sections/vpn-project";
import {Footer} from "@/components/layout/footer";
import {Header} from "@/components/layout/header";
import {content, isLocale} from "@/content";
import {siteConfig} from "@/lib/site";
import {notFound} from "next/navigation";

type PageProps = {params: Promise<{locale: string}>};

export default async function HomePage({params}: PageProps) {
  const {locale: localeParam} = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam;
  const copy = content[locale];
  const personJsonLd = {
    "@type": "Person",
    name: "Maxim Matsulevich",
    alternateName: "iwioke",
    jobTitle: "Graphic & web designer, creative developer",
    address: {"@type": "PostalAddress", addressLocality: "Minsk", addressCountry: "BY"},
    ...(siteConfig.siteUrl ? {url: siteConfig.siteUrl} : {}),
    sameAs: ["https://t.me/iwiokedamn", "https://www.instagram.com/iwiokebaa/", "https://github.com/iwioke"],
  };
  const workJsonLd = {
    "@type": "CreativeWork",
    name: "LM Group visual identity and websites",
    author: {"@type": "Person", name: "Maxim Matsulevich"},
    description: copy.work.lm.summary,
  };

  const jsonLd = {"@context": "https://schema.org", "@graph": [personJsonLd, workJsonLd]};

  return (
    <>
      <a className="skip-link" href="#main-content">{copy.nav.skipToContent}</a>
      <Header copy={copy.nav} locale={locale} />
      <main id="main-content">
        <Hero copy={copy.hero} />
        <FeaturedWork copy={copy.work} />
        <VpnProject copy={copy.work} />
        <Archive copy={copy.archive} />
        <Capabilities copy={copy.capabilities} />
        <About copy={copy.about} />
        <Contact copy={copy.contact} />
      </main>
      <Footer copy={copy.footer} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
    </>
  );
}
