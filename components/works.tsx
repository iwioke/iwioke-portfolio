"use client";

import Image from "next/image";
import {useEffect, useRef, useState, useSyncExternalStore} from "react";
import {contacts, site} from "@/content/site";
import {FOLDERS, WORKS, childrenOf, isFolderKey, media, topFolders, worksIn, type FolderKey, type MediaKey, type Work} from "@/content/works";

const PREFIX = "#folder-";
const external = {target: "_blank", rel: "noopener noreferrer"} as const;

const subscribe = (fn: () => void) => {
  addEventListener("hashchange", fn);
  addEventListener("folder-reset", fn);
  return () => {
    removeEventListener("hashchange", fn);
    removeEventListener("folder-reset", fn);
  };
};
const readHash = () => location.hash;
const serverHash = () => "";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
const pad = (n: number) => String(n).padStart(2, "0");

function Picture({k, alt, sizes, preload}: {k: MediaKey; alt: string; sizes: string; preload?: boolean}) {
  const m = media(k);
  return <Image src={m.src} width={m.width} height={m.height} alt={alt} sizes={sizes} preload={preload} />;
}

function WorkMedia({work, big}: {work: Work; big: boolean}) {
  const sizes = big ? "(max-width: 1080px) 100vw, 880px" : "(max-width: 820px) 100vw, (max-width: 1080px) 50vw, 420px";
  if (work.kind === "grid" && Array.isArray(work.src)) {
    return (
      <div className="grid" style={{gridTemplateColumns: `repeat(${work.cols ?? 2}, 1fr)`}}>
        {work.src.map((k) => <Picture key={k} k={k} alt="" sizes={big ? "(max-width: 1080px) 33vw, 300px" : "(max-width: 820px) 33vw, 140px"} />)}
      </div>
    );
  }
  return <Picture k={work.src as MediaKey} alt={work.title} sizes={sizes} />;
}

function FolderCard({k}: {k: FolderKey}) {
  const f = FOLDERS[k];
  const kids = childrenOf(k).length;
  const label = `${plural(worksIn(k), "work")}${kids ? ` · ${plural(kids, "project")}` : ""}`;
  return (
    <a className="folder" href={PREFIX + k}>
      <span className="stack">
        {f.cover.map((c) => <Picture key={c} k={c} alt="" sizes="(max-width: 820px) 45vw, 200px" />)}
      </span>
      <span className="f-info">
        <span className="label">{label}</span>
        <span className="f-title">{f.title}</span>
        <span className="f-desc">{f.desc}</span>
      </span>
      <span className="f-arrow" aria-hidden="true">→</span>
    </a>
  );
}

export function Works() {
  const hash = useSyncExternalStore(subscribe, readHash, serverHash);
  const raw = hash.startsWith(PREFIX) ? hash.slice(PREFIX.length) : "";
  const key = isFolderKey(raw) ? raw : null;
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  // a fresh visit always starts with all sections visible, even if the address still has #folder-…
  useEffect(() => {
    const nav = performance.getEntriesByType?.("navigation")[0] as PerformanceNavigationTiming | undefined;
    const initialHash = nav ? new URL(nav.name).hash : location.hash;
    if (location.hash.startsWith(PREFIX) && location.hash === initialHash) {
      history.replaceState(null, "", location.pathname + location.search);
      dispatchEvent(new Event("folder-reset"));
    }
    const onHash = () => {
      if (!location.hash.startsWith(PREFIX)) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById("works")?.scrollIntoView({behavior: reduce ? "auto" : "smooth"});
    };
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, []);

  const shown = key ? WORKS.filter((w) => w.cat === key) : [];
  const folder = key ? FOLDERS[key] : null;
  const current = index !== null ? shown[index] : undefined;

  useEffect(() => {
    const d = dialog.current;
    if (d && current && !d.open) d.showModal();
  }, [current]);

  const close = () => dialog.current?.close();
  const step = (by: number) => setIndex((i) => (i === null ? i : (i + by + shown.length) % shown.length));

  return (
    <>
      {!folder ? (
        <div className="folders">
          {topFolders.map((k) => <FolderCard key={k} k={k} />)}
        </div>
      ) : (
        <div className="folder-view">
          <div className="fv-head">
            <a className="back" href={folder.parent ? PREFIX + folder.parent : "#works"}>
              ← {folder.parent ? FOLDERS[folder.parent].title : site.works.allSections}
            </a>
            <h3 className="fv-title">{folder.title}</h3>
            <p className="fv-desc">{folder.desc}</p>
            {folder.link && <a className="back fv-link" href={folder.link.href} {...external}>{folder.link.label}</a>}
          </div>
          {childrenOf(key!).length > 0 && (
            <div className="folders sub">
              {childrenOf(key!).map((k) => <FolderCard key={k} k={k} />)}
            </div>
          )}
          {shown.length > 0 && (
            <ul className="works">
              {shown.map((w, i) => (
                <li className="work" key={`${w.cat}-${w.title}`}>
                  <button
                    className="work-open"
                    type="button"
                    aria-haspopup="dialog"
                    aria-label={`${site.works.open}: ${w.title}`}
                    data-view={`${site.works.view} ↗`}
                    onClick={() => setIndex(i)}
                  >
                    <span className="media"><WorkMedia work={w} big={false} /></span>
                  </button>
                  <div className="meta">
                    <span className="label">{w.label}</span>
                    <h3>{w.title}</h3>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <dialog
        className="lightbox"
        ref={dialog}
        aria-labelledby="lb-title"
        onClose={() => setIndex(null)}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        {current && (
          <div className="lb-inner">
            <div className="lb-media"><WorkMedia work={current} big /></div>
            <div className="lb-side">
              <div className="lb-top">
                <div className="lb-nav">
                  <button className="icon-btn" type="button" aria-label={site.works.previous} onClick={() => step(-1)}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
                  </button>
                  <button className="icon-btn" type="button" aria-label={site.works.next} onClick={() => step(1)}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
                  </button>
                </div>
                <button className="icon-btn lb-close" type="button" aria-label={site.works.close} onClick={close}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              </div>
              <span className="label lb-count">{`${pad(index! + 1)} / ${pad(shown.length)} · ${current.label}`}</span>
              <h3 id="lb-title">{current.title}</h3>
              <p className="lb-desc">{current.desc}</p>
              {folder?.link && <a className="back" href={folder.link.href} {...external}>{folder.link.label}</a>}
              <a className="pill" href={contacts.telegram.href} {...external}>{site.works.cta}</a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
