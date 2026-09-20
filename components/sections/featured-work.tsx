import Image from "next/image";
import {ArrowLink} from "@/components/ui/arrow-link";
import {Reveal} from "@/components/ui/reveal";
import {SectionHeading} from "@/components/ui/section-heading";
import type {PortfolioCopy} from "@/content/types";
import {projects} from "@/content/projects";

type FeaturedWorkProps = {copy: PortfolioCopy["work"]};

export function FeaturedWork({copy}: FeaturedWorkProps) {
  const lmGroup = projects[0];

  return (
    <section id="work" className="work section" aria-labelledby="work-title">
      <div className="shell">
        <SectionHeading eyebrow={copy.kicker} title={copy.title} id="work-title" />

        <article className="lm-feature">
          <div className="lm-feature__intro">
            <Reveal>
              <p className="eyebrow">{copy.lm.label}</p>
              <h3 className="display display--project">{copy.lm.title}</h3>
              <p className="lm-feature__summary">{copy.lm.summary}</p>
              <div className="tag-list" aria-label="Project disciplines">
                {lmGroup.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </Reveal>
          </div>

          <Reveal className="lm-collage" delay={0.1}>
            <figure className="lm-collage__primary">
              <Image src={lmGroup.media[0]} alt={copy.lm.imageAlts[0]} fill loading="eager" sizes="(max-width: 760px) 100vw, 62vw" className="image-cover" />
            </figure>
            <figure className="lm-collage__secondary">
              <Image src={lmGroup.media[1]} alt={copy.lm.imageAlts[1]} fill sizes="(max-width: 760px) 52vw, 30vw" className="image-cover" />
            </figure>
            <p className="lm-collage__mark" aria-hidden="true">LM<br />—</p>
          </Reveal>

          <div className="lm-feature__details">
            <Reveal>
              <div>
                <p className="detail-label">{copy.lm.scopeLabel}</p>
                <ul className="scope-list">
                  {copy.lm.scope.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="result-block">
                <p className="detail-label">{copy.lm.resultLabel}</p>
                <p>{copy.lm.result}</p>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="source-links">
                <p className="detail-label">{copy.lm.linksLabel}</p>
                {lmGroup.links.map((link) => (
                  <ArrowLink key={link.href} href={link.href} external>
                    {link.key === "europe" ? copy.lm.europe : copy.lm.kazakhstan}
                  </ArrowLink>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lm-rail">
            <figure>
              <Image src={lmGroup.media[2]} alt={copy.lm.imageAlts[2]} fill sizes="(max-width: 760px) 68vw, 28vw" className="image-cover" />
            </figure>
            <figure>
              <Image src={lmGroup.media[3]} alt={copy.lm.imageAlts[3]} fill sizes="(max-width: 760px) 68vw, 28vw" className="image-cover" />
            </figure>
          </div>
        </article>
      </div>
    </section>
  );
}
