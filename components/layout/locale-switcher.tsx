"use client";

import {usePathname, useRouter} from "next/navigation";
import type {Locale} from "@/content/types";

type LocaleSwitcherProps = {
  locale: Locale;
  label: string;
};

export function LocaleSwitcher({locale, label}: LocaleSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const otherLocale: Locale = locale === "en" ? "ru" : "en";
  const nextPath = pathname.replace(/^\/(en|ru)(?=\/|$)/, `/${otherLocale}`);

  function preserveHash(event: React.MouseEvent<HTMLAnchorElement>) {
    const hash = window.location.hash;
    if (hash) {
      event.preventDefault();
      router.push(`${nextPath}${hash}`);
    }
  }

  return (
    <a
      href={nextPath}
      onClick={preserveHash}
      className="locale-switcher"
      aria-label={`${label}: ${otherLocale.toUpperCase()}`}
      lang={otherLocale}
    >
      <span className={locale === "en" ? "is-active" : ""}>EN</span>
      <span aria-hidden="true">/</span>
      <span className={locale === "ru" ? "is-active" : ""}>RU</span>
    </a>
  );
}
