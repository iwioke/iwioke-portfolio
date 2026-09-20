import {ContactForm} from "@/components/contact/contact-form";
import {ContactLinks} from "@/components/contact/contact-links";
import {Reveal} from "@/components/ui/reveal";
import type {PortfolioCopy} from "@/content/types";

type ContactProps = {copy: PortfolioCopy["contact"]};

export function Contact({copy}: ContactProps) {
  return (
    <section id="contact" className="contact section" aria-labelledby="contact-title">
      <div className="shell">
        <div className="contact-heading">
          <p className="eyebrow">{copy.kicker}</p>
          <h2 id="contact-title" className="display display--contact">{copy.title}</h2>
          <p>{copy.intro}</p>
        </div>
        <div className="contact-layout">
          <Reveal><ContactLinks title={copy.direct} /></Reveal>
          <Reveal delay={0.1}><ContactForm copy={copy.form} /></Reveal>
        </div>
      </div>
    </section>
  );
}
