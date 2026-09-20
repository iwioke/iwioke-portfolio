import {ArrowLink} from "@/components/ui/arrow-link";
import {siteConfig} from "@/lib/site";
import type {PortfolioCopy} from "@/content/types";

type FooterProps = {copy: PortfolioCopy["footer"]};

export function Footer({copy}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="footer-tagline">{copy.tagline}</p>
        </div>
        <div className="footer-links" aria-label="Social links">
          <ArrowLink href={`mailto:${siteConfig.email}`}>Email</ArrowLink>
          <ArrowLink href={siteConfig.telegram} external>Telegram</ArrowLink>
          <ArrowLink href={siteConfig.instagram} external>Instagram</ArrowLink>
          <ArrowLink href={siteConfig.github} external>GitHub</ArrowLink>
        </div>
        <div className="footer-meta">
          <a href="#top">↑ {copy.backToTop}</a>
          <p>© {year} iwioke. {copy.rights}</p>
        </div>
      </div>
    </footer>
  );
}
