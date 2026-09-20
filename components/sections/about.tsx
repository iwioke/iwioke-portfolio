import {Reveal} from "@/components/ui/reveal";
import {SectionHeading} from "@/components/ui/section-heading";
import type {PortfolioCopy} from "@/content/types";

type AboutProps = {copy: PortfolioCopy["about"]};

export function About({copy}: AboutProps) {
  return (
    <section id="about" className="about section" aria-labelledby="about-title">
      <div className="shell about-layout">
        <SectionHeading eyebrow={copy.kicker} title={copy.title} id="about-title" />
        <Reveal className="about-copy" delay={0.1}>
          <p className="about-copy__body">{copy.body}</p>
          <p className="about-copy__note">{copy.note}</p>
          <dl className="about-facts">
            <div><dt>{copy.locationLabel}</dt><dd>{copy.location}</dd></div>
            <div><dt>{copy.availabilityLabel}</dt><dd>{copy.availability}</dd></div>
          </dl>
        </Reveal>
        <p className="about-monogram" aria-hidden="true">MM<br />IW</p>
      </div>
    </section>
  );
}
