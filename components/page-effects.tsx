"use client";

import {useEffect} from "react";
import {onValleyReady} from "@/lib/valley-bus";

/** Intro, header state, valley dimming and scroll reveals — everything the page does on its own. */
export function PageEffects() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: Array<ReturnType<typeof setTimeout>> = [];

    // ---- intro: the loader fades, then the interface appears ----
    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      document.getElementById("loader")?.classList.add("gone");
      timers.push(setTimeout(() => document.querySelectorAll(".ui").forEach((n) => n.classList.add("on")), 500));
    };
    const offReady = onValleyReady(show);
    timers.push(setTimeout(show, 4500)); // never keep the page hidden if 3D is slow

    // ---- header turns solid, the valley dims as you scroll ----
    const header = document.getElementById("top");
    const valley = document.getElementById("valley");
    const onScroll = () => {
      const k = Math.min(scrollY / innerHeight, 1);
      if (valley) valley.style.opacity = (1 - k * 0.7).toFixed(3);
      header?.classList.toggle("solid", scrollY > innerHeight * 0.6);
    };
    addEventListener("scroll", onScroll, {passive: true});
    onScroll();

    // ---- blocks rise in as they scroll into view ----
    let io: IntersectionObserver | undefined;
    if (!reduce && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => entries.forEach(({target, isIntersecting}) => {
          if (isIntersecting) { target.classList.add("in"); io?.unobserve(target); }
        }),
        {rootMargin: "0px 0px -8% 0px"},
      );
      const reveal = (nodes: Element[], step: number) => nodes.forEach((n, i) => {
        const el = n as HTMLElement;
        el.classList.add("reveal");
        el.style.setProperty("--d", `${(Math.min(i, 8) * step).toFixed(2)}s`);
        io?.observe(el);
      });
      const all = (s: string) => [...document.querySelectorAll(s)];
      reveal(all(".sec-head"), 0);
      reveal(all(".price-row"), 0.07);
      reveal([...all(".step"), ...all(".terms")], 0.1);
      reveal(all(".contact h2, .contact .lead, .contact .contact-links li"), 0.1);
    }

    return () => {
      offReady();
      timers.forEach(clearTimeout);
      removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  return null;
}
