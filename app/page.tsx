import {PageEffects} from "@/components/page-effects";
import {Title3D} from "@/components/title-3d";
import {Valley} from "@/components/valley";
import {GoButton} from "@/components/go-button";
import {Works} from "@/components/works";
import {contactLinks, contacts, services, site, steps, terms} from "@/content/site";
import {siteUrl} from "@/lib/site";

const external = {target: "_blank", rel: "noopener noreferrer"} as const;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: site.handle,
  jobTitle: "Graphic & web designer",
  address: {"@type": "PostalAddress", addressLocality: "Minsk", addressCountry: "BY"},
  email: contacts.email.address,
  ...(siteUrl ? {url: siteUrl} : {}),
  sameAs: [contacts.telegram.href, contacts.instagram.href, contacts.github.href],
};

export default function HomePage() {
  return (
    <>
      <div className="sky" aria-hidden="true" />
      <Valley />
      <div id="vignette" aria-hidden="true" />
      <div className="loader" id="loader" aria-hidden="true"><span /></div>

      <header className="top ui" id="top">
        <a className="logo" href="#hero">{site.handle}</a>
        <nav aria-label="Sections">
          <ul className="nav">
            {site.nav.map((item) => (
              <li key={item.href}><a href={item.href}>{item.label}</a></li>
            ))}
            <li><a className="pill" href={contacts.telegram.href} {...external}>{site.navCta}</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="hero ui" id="hero">
          <Title3D as="h1" text={site.hero.title} />
          <p className="cap">{site.hero.caption[0]}<br />{site.hero.caption[1]}</p>
          <GoButton label={site.hero.go} />
        </section>

        <div className="sections">
          <section className="block" id="works">
            <div className="wrap">
              <div className="sec-head works-head">
                <div><Title3D as="h2" text={site.works.title} /></div>
              </div>
              <Works />
            </div>
          </section>

          <section className="block" id="prices">
            <div className="wrap">
              <div className="sec-head">
                <div><h2>{site.prices.title[0]} <b>{site.prices.title[1]}</b></h2></div>
                <p>{site.prices.intro}</p>
              </div>
              <ul className="price-list">
                {services.map((s) => (
                  <li className="price-row" key={s.title}>
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                    <span className="price">{s.price}</span>
                    <a className="order" href={contacts.telegram.href} {...external}>
                      {"custom" in s ? site.prices.write : site.prices.order} →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="block" id="process">
            <div className="wrap">
              <div className="sec-head">
                <div><h2>{site.process.title[0]} <b>{site.process.title[1]}</b></h2></div>
              </div>
              <ol className="steps">
                {steps.map((s, i) => (
                  <li className="step" key={s.title}>
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </li>
                ))}
              </ol>
              <ul className="terms">
                {terms.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          </section>

          <section className="block contact" id="contact">
            <div className="wrap">
              <h2>{site.contact.title[0]} <b>{site.contact.title[1]}</b></h2>
              <p className="lead">{site.contact.lead}</p>
              <ul className="contact-links">
                {contactLinks.map((l) => (
                  <li key={l.href}>
                    <a className="pill" href={l.href} {...(l.href.startsWith("mailto:") ? {} : external)}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>

      <footer>
        <div className="wrap"><span className="label">{site.footer}</span></div>
      </footer>

      <PageEffects />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
    </>
  );
}
