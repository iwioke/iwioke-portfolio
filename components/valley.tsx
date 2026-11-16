"use client";

import {useEffect, useRef} from "react";
import {markValleyReady, setGatherListener} from "@/lib/valley-bus";

/** Fixed WebGL background. three.js is loaded lazily so it never blocks first paint. */
export function Valley() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let disposed = false;
    let dispose: (() => void) | undefined;
    const fail = () => { document.documentElement.classList.add("no-webgl"); markValleyReady(); };

    import("@/lib/valley")
      .then(({createValley}) => {
        if (disposed) return;
        const valley = createValley(host, {onReady: markValleyReady});
        setGatherListener(valley.gather);
        dispose = valley.dispose;
      })
      .catch(fail);

    return () => {
      disposed = true;
      setGatherListener(null);
      dispose?.();
    };
  }, []);

  return <div id="valley" ref={ref} aria-hidden="true" />;
}
