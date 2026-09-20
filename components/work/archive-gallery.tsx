"use client";

import Image from "next/image";
import {AnimatePresence, motion, useReducedMotion} from "motion/react";
import {useCallback, useEffect, useRef, useState} from "react";
import type {GalleryItem, PortfolioCopy} from "@/content/types";

type ArchiveGalleryProps = {
  items: GalleryItem[];
  copy: PortfolioCopy["archive"];
};

export function ArchiveGallery({items, copy}: ArchiveGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const currentIndex = activeIndex ?? 0;
  const active = activeIndex === null ? null : items[currentIndex];
  const activeCopy = activeIndex === null ? null : copy.items[currentIndex];

  const close = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const previous = useCallback(() => {
    setActiveIndex((current) => current === null ? 0 : (current - 1 + items.length) % items.length);
  }, [items.length]);

  const next = useCallback(() => {
    setActiveIndex((current) => current === null ? 0 : (current + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
      if (event.key === "Tab") {
        const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])") ?? []);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, close, next, previous]);

  return (
    <>
      <div className="archive-grid">
        {items.map((item, index) => {
          const itemCopy = copy.items[index];
          return (
            <motion.button
              type="button"
              key={item.id}
              className={`archive-item archive-item--${index + 1}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`${copy.open}: ${itemCopy.title}`}
              whileHover={reducedMotion ? undefined : {y: -5}}
              transition={{duration: 0.25}}
            >
              <span className="archive-item__image">
                <Image src={item.image} alt={itemCopy.alt} fill sizes="(max-width: 760px) 92vw, (max-width: 1100px) 46vw, 30vw" className="image-cover" />
              </span>
              <span className="archive-item__meta"><span>{itemCopy.category}</span><b>{itemCopy.title}</b></span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {active && activeCopy ? (
          <motion.div
            className="lightbox-backdrop"
            role="presentation"
            initial={reducedMotion ? false : {opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onMouseDown={(event) => { if (event.currentTarget === event.target) close(); }}
          >
            <section ref={dialogRef} className="lightbox" role="dialog" aria-modal="true" aria-label={activeCopy.title}>
              <div className="lightbox__topbar">
                <p>{copy.count.replace("{current}", String(currentIndex + 1)).replace("{total}", String(items.length))}</p>
                <button ref={closeButton} type="button" onClick={close} aria-label={copy.close}>×</button>
              </div>
              <div className="lightbox__image">
                <Image src={active.image} alt={activeCopy.alt} fill sizes="100vw" className="image-contain" priority />
              </div>
              <div className="lightbox__bottom">
                <div><p>{activeCopy.category}</p><h3>{activeCopy.title}</h3></div>
                <div className="lightbox__controls">
                  <button type="button" onClick={previous} aria-label={copy.previous}>←</button>
                  <button type="button" onClick={next} aria-label={copy.next}>→</button>
                </div>
              </div>
            </section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
