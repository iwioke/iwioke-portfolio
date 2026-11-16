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

export const services = [
  {title: "Logo design", description: "A unique logo with matching type and colour, delivered as files ready for digital and print.", price: "$200–400"},
  {title: "Brand identity", description: "Logo, colour system, typography, graphic elements, a basic brand book and applications.", price: "$600–1,200"},
  {title: "Poster design", description: "An original poster, ad banner or editorial layout built on typography and a clear visual idea.", price: "$80–150"},
  {title: "Website design", description: "UI/UX design in Figma: structure, visual concept, responsive layouts and a developer-ready handoff.", price: "$350–750"},
  {title: "Website development", description: "A responsive site in HTML, CSS, JavaScript, React or Next.js — design, animation and basic optimisation.", price: "$700–1,500"},
  {title: "Full website", description: "Design and development in one project: Figma layouts and a responsive build of the finished site.", price: "$1,050–2,250"},
  {title: "Your own idea", description: "Custom work: web apps, process automation, interfaces and other non-standard digital projects.", price: "from $30/hr", custom: true},
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
