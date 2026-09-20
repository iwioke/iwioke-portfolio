import type {GalleryItem, Project} from "./types";

export const projects: Project[] = [
  {
    id: "lm-group",
    tags: ["Brand identity", "Web design", "Figma", "Tailwind"],
    media: [
      "/images/lm-group/billboard.jpg",
      "/images/lm-group/boxes.jpg",
      "/images/lm-group/logo-mockup.jpg",
      "/images/lm-group/identity-system.jpg",
    ],
    links: [
      {key: "europe", href: "https://github.com/iwioke/lm-group-europe-website"},
      {key: "kazakhstan", href: "https://github.com/iwioke/lm-group-kazakhstan-website"},
    ],
  },
  {
    id: "iwiqovpn",
    tags: ["Swift", "SwiftUI", "AppKit", "WireGuard"],
    media: ["/images/iwiqovpn/menu-bar.jpg", "/images/iwiqovpn/app-screen.jpg"],
    links: [{key: "repository", href: "https://github.com/iwioke/iwiqoVPN"}],
  },
];

export const gallery: GalleryItem[] = [
  {id: "group-11", image: "/images/archive/group-11.jpg"},
  {id: "group-12", image: "/images/archive/group-12.jpg"},
  {id: "group-17", image: "/images/archive/group-17.jpg"},
  {id: "group-20", image: "/images/archive/group-20.jpg"},
  {id: "group-24", image: "/images/archive/group-24.jpg"},
  {id: "group-29", image: "/images/archive/group-29.jpg"},
];
