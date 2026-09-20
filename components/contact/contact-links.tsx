import {ArrowLink} from "@/components/ui/arrow-link";
import {siteConfig} from "@/lib/site";

type ContactLinksProps = {title: string};

export function ContactLinks({title}: ContactLinksProps) {
  return (
    <aside className="contact-links" aria-label={title}>
      <p className="contact-links__title">{title}</p>
      <div>
        <ArrowLink href={`mailto:${siteConfig.email}`}>{siteConfig.email}</ArrowLink>
        <ArrowLink href={siteConfig.telegram} external>Telegram</ArrowLink>
        <ArrowLink href={siteConfig.instagram} external>Instagram</ArrowLink>
        <ArrowLink href={siteConfig.github} external>GitHub</ArrowLink>
      </div>
    </aside>
  );
}
