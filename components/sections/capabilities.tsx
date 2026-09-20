import {Reveal} from "@/components/ui/reveal";
import {SectionHeading} from "@/components/ui/section-heading";
import type {PortfolioCopy} from "@/content/types";

type CapabilitiesProps = {copy: PortfolioCopy["capabilities"]};

export function Capabilities({copy}: CapabilitiesProps) {
  return (
    <section className="capabilities section" aria-labelledby="capabilities-title">
      <div className="shell">
        <SectionHeading eyebrow={copy.kicker} title={copy.title} intro={copy.intro} id="capabilities-title" />
        <div className="capabilities-list">
          {copy.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <article className="capability">
                <p className="capability__number">{item.number}</p>
                <h3>{item.title}</h3>
                <p className="capability__description">{item.description}</p>
                <ul>{item.list.map((itemText) => <li key={itemText}>{itemText}</li>)}</ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
