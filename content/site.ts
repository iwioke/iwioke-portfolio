export const contacts = {
  telegram: {href: "https://t.me/iwiokedamn", handle: "@iwiokedamn"},
  email: {href: "mailto:iwiokework@gmail.com", address: "iwiokework@gmail.com"},
  instagram: {href: "https://www.instagram.com/iwiokebaa/", handle: "@iwiokebaa"},
  github: {href: "https://github.com/iwioke", handle: "iwioke"},
} as const;

export const site = {
  name: "Maxim Matsulevich",
  handle: "iwioke",
  title: "iwioke — Maxim Matsulevich, graphic & web designer",
  description:
    "Portfolio of Maxim Matsulevich (iwioke), a graphic and web designer from Minsk: brand identities, posters and multilingual websites — from idea to code.",
  nav: [
    {href: "#works", label: "Work"},
    {href: "#prices", label: "Pricing"},
    {href: "#process", label: "Process"},
  ],
  navCta: "Message me",
  hero: {
    title: "iwioke",
    caption: ["Graphic & web designer from Minsk.", "Identities, posters and websites."],
    go: "View work",
  },
  works: {
    title: "my work",
    allSections: "All sections",
    open: "Open",
    view: "view",
    cta: "I want one like this",
    previous: "Previous work",
    next: "Next work",
    close: "Close",
  },
  prices: {
    title: ["what it", "costs"],
    intro: "The exact price depends on the task — tell me what you need and I’ll put together a quote.",
    order: "order",
    write: "message",
  },
  process: {
    title: ["how I", "work"],
  },
  contact: {
    title: ["new", "project?"],
    lead: "Tell me what you need — I’ll reply with ideas.",
  },
  footer: "iwioke — Maxim Matsulevich",
} as const;

/** Prices are intentionally "on request" until confirmed by the owner. */
export const services = [
  {title: "Logo", description: "A distinctive mark or wordmark that stays readable from a favicon to a billboard.", price: "on request"},
  {title: "Brand identity", description: "Logo, type and colour, carried through merch, stationery, packaging and signage.", price: "on request"},
  {title: "Poster", description: "Posters and editorial layouts built around a strong typographic idea.", price: "on request"},
  {title: "Website design", description: "Landing pages and business websites designed in Figma for real screens.", price: "on request"},
  {title: "Website development", description: "Responsive, multilingual sites built with HTML, Tailwind CSS, React or Next.js.", price: "on request"},
  {title: "Your own idea", description: "A macOS app, a motion piece or something not on the list? Describe it and I’ll quote it.", price: "on request", custom: true},
] as const;

export const steps = [
  {title: "Brief", text: "Message me on Telegram or by email: what you need, where it will live, the deadline and references you like."},
  {title: "Scope & quote", text: "We agree on the scope, timing and price before any work starts."},
  {title: "Concept & revisions", text: "I present the first direction, then we refine it together until it feels right."},
  {title: "Final files", text: "You receive production-ready files for print, web or development."},
] as const;

export const terms = ["based in Minsk, Belarus", "working remotely", "design + development", "telegram or email"] as const;

export const contactLinks = [
  {href: contacts.telegram.href, label: `Message ${contacts.telegram.handle}`},
  {href: contacts.email.href, label: "Email ↗"},
  {href: contacts.instagram.href, label: "Instagram ↗"},
  {href: contacts.github.href, label: "GitHub ↗"},
] as const;
