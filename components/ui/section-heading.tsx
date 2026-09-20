type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  id: string;
  inverse?: boolean;
};

export function SectionHeading({eyebrow, title, intro, id, inverse = false}: SectionHeadingProps) {
  return (
    <div className={`section-heading ${inverse ? "section-heading--inverse" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="display display--section">
        {title}
      </h2>
      {intro ? <p className="section-intro">{intro}</p> : null}
    </div>
  );
}
