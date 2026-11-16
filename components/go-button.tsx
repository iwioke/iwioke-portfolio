"use client";

import {gatherValley} from "@/lib/valley-bus";

/** Round arrow under the hero; hovering it lifts the flowers into the air. */
export function GoButton({label}: {label: string}) {
  const on = () => gatherValley(true);
  const off = () => gatherValley(false);
  return (
    <a className="go" href="#works" id="go" aria-label={label} onPointerEnter={on} onPointerLeave={off} onFocus={on} onBlur={off}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M6 14l6 6 6-6" /></svg>
    </a>
  );
}
