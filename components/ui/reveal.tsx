"use client";

import {motion, useReducedMotion} from "motion/react";
import type {ReactNode} from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({children, className, delay = 0}: RevealProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : {opacity: 0, y: 18}}
      whileInView={reducedMotion ? undefined : {opacity: 1, y: 0}}
      viewport={{once: true, amount: 0.18}}
      transition={{duration: 0.55, delay, ease: [0.16, 1, 0.3, 1]}}
    >
      {children}
    </motion.div>
  );
}
