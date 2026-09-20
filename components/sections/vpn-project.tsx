import Image from "next/image";
import {ArrowLink} from "@/components/ui/arrow-link";
import {Reveal} from "@/components/ui/reveal";
import type {PortfolioCopy} from "@/content/types";
import {projects} from "@/content/projects";

type VpnProjectProps = {copy: PortfolioCopy["work"]};

export function VpnProject({copy}: VpnProjectProps) {
  const vpn = projects[1];

  return (
    <section className="vpn-project" aria-labelledby="vpn-title">
      <div className="shell vpn-project__layout">
        <Reveal className="vpn-project__media">
          <div className="vpn-project__browser">
            <div className="browser-chrome"><span /><span /><span /><b>iwiqoVPN</b></div>
            <div className="vpn-project__image">
              <Image src={vpn.media[0]} alt={copy.vpn.imageAlt} fill sizes="(max-width: 760px) 86vw, 46vw" className="image-contain" />
            </div>
          </div>
          <span className="vpn-project__sticker">NATIVE<br />MACOS<br />UTILITY</span>
        </Reveal>
        <Reveal className="vpn-project__copy" delay={0.12}>
          <p className="eyebrow">{copy.vpn.label}</p>
          <h2 id="vpn-title" className="display display--project">{copy.vpn.title}</h2>
          <p>{copy.vpn.summary}</p>
          <p className="vpn-project__detail">{copy.vpn.detail}</p>
          <ArrowLink href={vpn.links[0].href} external>{copy.vpn.repository}</ArrowLink>
        </Reveal>
      </div>
    </section>
  );
}
