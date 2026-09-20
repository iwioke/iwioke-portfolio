import {en} from "./en";
import {ru} from "./ru";
import type {Locale, PortfolioCopy} from "./types";

export const locales = ["en", "ru"] as const;
export const defaultLocale: Locale = "en";

export const content: Record<Locale, PortfolioCopy> = {en, ru};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
