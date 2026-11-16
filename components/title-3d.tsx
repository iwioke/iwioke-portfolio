"use client";

import {useEffect, useRef} from "react";

type Props = {as: "h1" | "h2"; text: string};

/**
 * Letters float on their own; when the cursor reaches the title the whole word
 * sinks back in depth as one piece and tilts toward the pointer. A tap does the same on touch screens.
 */
export function Title3D({as: Tag, text}: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  let n = 0;

  useEffect(() => {
    const title = ref.current;
    if (!title || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = [...title.querySelectorAll<HTMLElement>(".ch")].map((s) => ({s, z: 0, rx: 0, o: 1}));
    let mx = -9999, my = -9999, over = 0, overTarget = 0, tiltX = 0, tiltY = 0, raf = 0;
    let touchTimer: ReturnType<typeof setTimeout> | undefined;

    const tick = () => {
      raf = 0;
      over += (overTarget - over) * 0.09;
      const box = title.getBoundingClientRect();
      const tx = overTarget ? ((mx - box.left) / box.width - 0.5) * 2 : 0;
      const ty = overTarget ? ((my - box.top) / box.height - 0.5) * 2 : 0;
      tiltX += (ty * -10 - tiltX) * 0.08;
      tiltY += (tx * 14 - tiltY) * 0.08;
      title.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
      let moving = Math.abs(overTarget - over) > 0.002 || Math.abs(tiltX) + Math.abs(tiltY) > 0.05;
      const z = -over * 520, rx = over * 14, o = 1 - over * 0.35;
      for (const L of letters) {
        L.z += (z - L.z) * 0.12; L.rx += (rx - L.rx) * 0.12; L.o += (o - L.o) * 0.12;
        if (Math.abs(z - L.z) > 0.3) moving = true;
        L.s.style.transform = `translateZ(${L.z.toFixed(1)}px) rotateX(${L.rx.toFixed(1)}deg)`;
        L.s.style.opacity = L.o.toFixed(3);
      }
      if (moving || overTarget) raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const near = (x: number, y: number) => {
      const b = title.getBoundingClientRect(), m = overTarget ? 90 : 20;
      return x > b.left - m && x < b.right + m && y > b.top - m && y < b.bottom + m;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      mx = e.clientX; my = e.clientY;
      overTarget = near(mx, my) ? 1 : 0;
      kick();
    };
    const onLeave = () => { overTarget = 0; kick(); };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      mx = e.clientX; my = e.clientY; overTarget = 1; kick();
      clearTimeout(touchTimer);
      touchTimer = setTimeout(() => { overTarget = 0; kick(); }, 1400);
    };
    addEventListener("pointermove", onMove, {passive: true});
    document.addEventListener("pointerleave", onLeave);
    title.addEventListener("pointerdown", onDown);
    return () => {
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      title.removeEventListener("pointerdown", onDown);
      cancelAnimationFrame(raf);
      clearTimeout(touchTimer);
    };
  }, []);

  return (
    <Tag ref={ref} className="title3d" aria-label={text}>
      {text.split(" ").map((word, wi) => (
        <span key={wi}>
          {wi > 0 && " "}
          <span className="word" aria-hidden="true">
            {[...word].map((ch, ci) => (
              <span className="ch" key={ci}>
                <span className="in" style={{animationDelay: `${(n++ * -0.23).toFixed(2)}s`}}>{ch}</span>
              </span>
            ))}
          </span>
        </span>
      ))}
    </Tag>
  );
}
