import Image from "next/image";
import {Reveal} from "@/components/ui/reveal";
import type {PortfolioCopy} from "@/content/types";

type HeroProps = {copy: PortfolioCopy["hero"]};

export function Hero({copy}: HeroProps) {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="shell hero-layout">
        <div className="hero-copy">
          <Reveal>
            <p className="eyebrow hero-eyebrow"><span className="status-dot" />{copy.eyebrow}</p>
          </Reveal>
          <h1 id="hero-title" className="display hero-title">
            <span>{copy.lineOne}</span>
            <span className="hero-title__indent">{copy.lineTwo}</span>
            <span className="hero-title__accent">{copy.lineThree}</span>
          </h1>
          <Reveal delay={0.18}>
            <div className="hero-bottom">
              <p className="hero-intro">{copy.intro}</p>
              <div className="hero-actions">
                <a className="button button--ink" href="#work">{copy.viewWork}<span aria-hidden="true">↓</span></a>
                <a className="button button--outline" href="#contact">{copy.startProject}<span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="hero-art" delay={0.12}>
          <div className="hero-art__eyebrow">LM GROUP / 01</div>
          <div className="hero-art__image">
            <Image
              src="/images/lm-group/billboard.jpg"
              alt=""
              fill
              priority
              sizes="(max-width: 760px) 82vw, 36vw"
              className="image-cover"
            />
          </div>
          <span className="hero-art__circle" />
          <span className="hero-art__caption">IDENTITY<br />IN MOTION</span>
        </Reveal>

        <div className="hero-foot">
          <p>{copy.availability}</p>
          <a href="#work" className="hero-scroll"><span>{copy.scrollHint}</span><i aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
