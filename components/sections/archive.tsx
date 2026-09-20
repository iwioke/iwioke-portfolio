import {SectionHeading} from "@/components/ui/section-heading";
import {ArchiveGallery} from "@/components/work/archive-gallery";
import {gallery} from "@/content/projects";
import type {PortfolioCopy} from "@/content/types";

type ArchiveProps = {copy: PortfolioCopy["archive"]};

export function Archive({copy}: ArchiveProps) {
  return (
    <section id="archive" className="archive section" aria-labelledby="archive-title">
      <div className="shell">
        <SectionHeading eyebrow={copy.kicker} title={copy.title} intro={copy.intro} id="archive-title" />
        <ArchiveGallery items={gallery} copy={copy} />
      </div>
    </section>
  );
}
