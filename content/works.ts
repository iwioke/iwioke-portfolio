/** Image dimensions of the optimised files in /public/media (width, height). */
const DIMENSIONS = {
  "eu-about": [2000, 1250], "eu-hero": [2000, 1042], "eu-mobile": [1170, 1980], "eu-services": [2000, 1250],
  "eu-warehouse": [2000, 1250], "kz-about": [2000, 1250], "kz-hero": [2000, 1250], "kz-mobile": [924, 2000],
  "kz-routes": [2000, 1250], "kz-services": [2000, 1250], "lm-billboard": [2000, 1334], "lm-boxes": [2000, 1622],
  "lm-hoodie": [2000, 1334], "lm-logo-paper": [2000, 1500], "lm-notebook-open": [2000, 1216], "lm-notebook": [1408, 2000],
  "lm-notebooks": [2000, 626], "lm-pens": [1693, 984], "lm-puffer": [2000, 1334], "lm-shopping-bags": [2000, 1336],
  "lm-signage": [2000, 2000], "lm-stationery": [2000, 1170], "lm-tote": [2000, 1600], "lm-tshirt": [2000, 1334],
  "poster-binhits": [1556, 1550], "poster-broken": [1584, 1920], "poster-cannibalism": [2000, 1430],
  "poster-castle": [1448, 2000], "poster-consistency": [1732, 2000], "poster-ecstasy-pink": [1316, 2000],
  "poster-ecstasy": [1316, 2000], "poster-ego": [1394, 1920], "poster-euphoria": [1506, 2000],
  "poster-goats": [1342, 1913], "poster-grind": [1416, 1920], "poster-inception": [1306, 1786],
  "poster-savior": [1372, 2000], "poster-side": [1212, 1315],
} as const satisfies Record<string, readonly [number, number]>;

export type MediaKey = keyof typeof DIMENSIONS;
export type Media = {src: string; width: number; height: number};

export const media = (key: MediaKey): Media => {
  const [width, height] = DIMENSIONS[key];
  return {src: `/media/${key}.jpg`, width, height};
};

export type FolderKey = "identity" | "lm-group" | "websites" | "lm-europe" | "lm-kazakhstan" | "posters";

export type Folder = {
  title: string;
  desc: string;
  cover: [MediaKey, MediaKey, MediaKey];
  parent?: FolderKey;
  link?: {href: string; label: string};
};

export type Work = {
  cat: FolderKey;
  kind: "img" | "grid";
  src: MediaKey | MediaKey[];
  cols?: number;
  title: string;
  label: string;
  desc: string;
};

export const FOLDERS: Record<FolderKey, Folder> = {
  identity: {
    title: "Brand identity",
    desc: "Logos and the systems around them — from merch and stationery to packaging, signage and outdoor.",
    cover: ["lm-hoodie", "lm-boxes", "lm-billboard"],
  },
  "lm-group": {
    parent: "identity",
    title: "LM Group",
    desc: "A complete identity for an international freight and logistics company: logo, merch, stationery, packaging, signage and outdoor.",
    cover: ["lm-shopping-bags", "lm-signage", "lm-tote"],
  },
  websites: {
    title: "Websites",
    desc: "Multilingual landing pages for logistics companies — designed and built on top of the same identity.",
    cover: ["kz-hero", "eu-services", "eu-hero"],
  },
  "lm-europe": {
    parent: "websites",
    title: "LM Group Europe",
    desc: "A monochrome, multilingual landing page for freight transport and warehouse logistics, with an animated WebGL hero and GSAP motion.",
    cover: ["eu-about", "eu-warehouse", "eu-hero"],
    link: {href: "https://llclmgroup.com", label: "llclmgroup.com ↗"},
  },
  "lm-kazakhstan": {
    parent: "websites",
    title: "LM Group Kazakhstan",
    desc: "The Kazakhstan branch site: the same system in a blue-and-yellow palette, multilingual and fully responsive.",
    cover: ["kz-about", "kz-routes", "kz-hero"],
    link: {href: "https://llclmgroup.store", label: "llclmgroup.store ↗"},
  },
  posters: {
    title: "Posters",
    desc: "Typographic posters and visual experiments: collage, halftone, texture and type as image.",
    cover: ["poster-ecstasy", "poster-savior", "poster-broken"],
  },
};

export const WORKS: Work[] = [
  // LM Group (inside "Brand identity")
  {cat: "lm-group", kind: "img", src: "lm-billboard", title: "Billboard", label: "identity · outdoor", desc: "The LM Group logo on a night-time billboard — the identity at its largest scale."},
  {cat: "lm-group", kind: "img", src: "lm-logo-paper", title: "Logo", label: "identity · logo", desc: "The M-shaped mark with the GROUP wordmark, embossed on paper."},
  {cat: "lm-group", kind: "img", src: "lm-boxes", title: "Packaging", label: "identity · packaging", desc: "Branded shipping boxes — the mark and wordmark working on every face."},
  {cat: "lm-group", kind: "img", src: "lm-signage", title: "Light box sign", label: "identity · signage", desc: "A double-sided light box for the office façade."},
  {cat: "lm-group", kind: "grid", cols: 3, src: ["lm-tshirt", "lm-hoodie", "lm-puffer"], title: "Apparel", label: "identity · merch", desc: "T-shirt, hoodie and puffer jacket with a quiet chest logo."},
  {cat: "lm-group", kind: "img", src: "lm-tote", title: "Tote bag", label: "identity · merch", desc: "A white tote with the full logo — merch that doubles as a moving sign."},
  {cat: "lm-group", kind: "img", src: "lm-shopping-bags", title: "Shopping bags", label: "identity · merch", desc: "Black paper bags with a tone-on-tone logo."},
  {cat: "lm-group", kind: "img", src: "lm-stationery", title: "Stationery set", label: "identity · stationery", desc: "Notebook, card, pencils and clip in black with a small white mark."},
  {cat: "lm-group", kind: "img", src: "lm-notebook", title: "Notebook", label: "identity · stationery", desc: "A black hardcover notebook with the mark in the corner."},
  {cat: "lm-group", kind: "img", src: "lm-notebook-open", title: "Notebook spread", label: "identity · stationery", desc: "Inside pages with the mark repeated in the corners."},
  {cat: "lm-group", kind: "img", src: "lm-notebooks", title: "Spiral notebooks", label: "identity · stationery", desc: "Spiral notebooks in black and white."},
  {cat: "lm-group", kind: "img", src: "lm-pens", title: "Pens", label: "identity · merch", desc: "Matte black pens with the wordmark along the barrel."},
  // LM Group Europe (inside "Websites")
  {cat: "lm-europe", kind: "img", src: "eu-hero", title: "Hero screen", label: "web · desktop", desc: "The opening screen: an animated monochrome wave and a typographic headline with italic accents."},
  {cat: "lm-europe", kind: "img", src: "eu-about", title: "About", label: "web · desktop", desc: "Company introduction with key facts laid out as a clean data table."},
  {cat: "lm-europe", kind: "img", src: "eu-services", title: "Services", label: "web · desktop", desc: "Service cards for transport logistics and foreign-trade outsourcing."},
  {cat: "lm-europe", kind: "img", src: "eu-warehouse", title: "Warehouse & groupage", label: "web · desktop", desc: "The second row of services: warehouse logistics and groupage shipping."},
  {cat: "lm-europe", kind: "img", src: "eu-mobile", title: "Mobile version", label: "web · mobile", desc: "The same hero on a phone — the headline and wave scale down without losing rhythm."},
  // LM Group Kazakhstan (inside "Websites")
  {cat: "lm-kazakhstan", kind: "img", src: "kz-hero", title: "Hero screen", label: "web · desktop", desc: "The opening screen in the branch palette: a blue-and-yellow wave behind the headline."},
  {cat: "lm-kazakhstan", kind: "img", src: "kz-about", title: "About", label: "web · desktop", desc: "Company introduction with routes and service lines in a light blue table."},
  {cat: "lm-kazakhstan", kind: "img", src: "kz-services", title: "Services", label: "web · desktop", desc: "Service cards adapted to the Kazakhstan palette."},
  {cat: "lm-kazakhstan", kind: "img", src: "kz-routes", title: "Routes in numbers", label: "web · desktop", desc: "A bold blue band with the main routes and the company promise."},
  {cat: "lm-kazakhstan", kind: "img", src: "kz-mobile", title: "Mobile version", label: "web · mobile", desc: "The hero on a phone, with the route figures stacked below the headline."},
  // Posters
  {cat: "posters", kind: "img", src: "poster-broken", title: "Broken", label: "poster · halftone", desc: "A blindfolded halftone portrait under a red-and-black serif headline."},
  {cat: "posters", kind: "img", src: "poster-savior", title: "Savior", label: "poster · typography", desc: "A classical portrait paired with a towering vertical serif."},
  {cat: "posters", kind: "img", src: "poster-side", title: "Side", label: "poster · typography", desc: "A red duotone portrait cut through by oversized letterforms."},
  {cat: "posters", kind: "img", src: "poster-ecstasy", title: "Ecstasy", label: "poster · black & white", desc: "A high-contrast black-and-white portrait framed by a vertical wordmark."},
  {cat: "posters", kind: "img", src: "poster-ecstasy-pink", title: "Ecstasy — pink", label: "poster · colour study", desc: "The same theme reworked in pink and deep blue with painterly texture."},
  {cat: "posters", kind: "img", src: "poster-binhits", title: "Binhits", label: "poster · editorial", desc: "A close-up of eyes over an arched red serif and a tracklist set like a record sleeve."},
  {cat: "posters", kind: "img", src: "poster-goats", title: "Goats?", label: "poster · collage", desc: "Pixelated pasture, grazing sheep and a blurred, smeared headline."},
  {cat: "posters", kind: "img", src: "poster-grind", title: "Rise and Grind", label: "poster · collage", desc: "An alarm clock collage with splatter, an asterisk and scattered grotesque type."},
  {cat: "posters", kind: "img", src: "poster-ego", title: "Ego", label: "poster · collage", desc: "Gothic architecture torn open by a strip of warm, glowing texture."},
  {cat: "posters", kind: "img", src: "poster-castle", title: "Castle", label: "poster · typography", desc: "Calligraphic script over a stippled castle on a soft grey field."},
  {cat: "posters", kind: "img", src: "poster-inception", title: "Inception", label: "poster · film", desc: "A film tribute: stretched display type above red halftone frames."},
  {cat: "posters", kind: "img", src: "poster-consistency", title: "Consistency", label: "poster · black & white", desc: "A lone figure at the foot of light-struck stairs, under heavy condensed type."},
  {cat: "posters", kind: "img", src: "poster-euphoria", title: "Euphoria", label: "poster · minimal", desc: "A single red field with a tone-on-tone embossed title."},
  {cat: "posters", kind: "img", src: "poster-cannibalism", title: "A Kiss Is the Beginning of Cannibalism", label: "poster · photo", desc: "A black-and-white kiss with a red circular cut-out at its centre."},
];

export const childrenOf = (key: FolderKey) =>
  (Object.keys(FOLDERS) as FolderKey[]).filter((k) => FOLDERS[k].parent === key);

export const worksIn = (key: FolderKey): number =>
  WORKS.filter((w) => w.cat === key).length + childrenOf(key).reduce((n, k) => n + worksIn(k), 0);

export const topFolders = (Object.keys(FOLDERS) as FolderKey[]).filter((k) => !FOLDERS[k].parent);

export const isFolderKey = (value: string): value is FolderKey => value in FOLDERS;
