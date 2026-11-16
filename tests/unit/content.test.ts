import {existsSync} from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";
import {contactLinks, contacts, services, site, steps, terms} from "@/content/site";
import {FOLDERS, WORKS, childrenOf, media, topFolders, worksIn, type FolderKey, type MediaKey} from "@/content/works";

const CYRILLIC = /[\u0400-\u04FF]/;

describe("content", () => {
  it("contains no Cyrillic text", () => {
    const all = JSON.stringify({site, services, steps, terms, contactLinks, contacts, FOLDERS, WORKS});
    expect(all).not.toMatch(CYRILLIC);
  });

  it("references only media files that exist", () => {
    const keys = new Set<MediaKey>([
      ...Object.values(FOLDERS).flatMap((f) => f.cover),
      ...WORKS.flatMap((w) => (Array.isArray(w.src) ? w.src : [w.src])),
    ]);
    for (const k of keys) expect(existsSync(path.join("public", media(k).src)), k).toBe(true);
  });

  it("gives every folder something to open", () => {
    for (const k of Object.keys(FOLDERS) as FolderKey[]) expect(worksIn(k), k).toBeGreaterThan(0);
    expect(topFolders).toEqual(["identity", "websites", "posters"]);
    expect(childrenOf("websites")).toEqual(["lm-europe", "lm-kazakhstan"]);
  });

  it("uses secure external links", () => {
    const hrefs = [...contactLinks.map((l) => l.href), ...Object.values(FOLDERS).flatMap((f) => (f.link ? [f.link.href] : []))];
    for (const href of hrefs) expect(href).toMatch(/^(https:\/\/|mailto:)/);
  });
});
