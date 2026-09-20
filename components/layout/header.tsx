"use client";

import {useEffect, useState} from "react";
import {LocaleSwitcher} from "./locale-switcher";
import type {Locale, PortfolioCopy} from "@/content/types";

type HeaderProps = {
  copy: PortfolioCopy["nav"];
  locale: Locale;
};

export function Header({copy, locale}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const links = [
    {href: "#work", label: copy.work},
    {href: "#archive", label: copy.archive},
    {href: "#about", label: copy.about},
    {href: "#contact", label: copy.contact},
  ];

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="wordmark" href="#top" aria-label="Maxim Matsulevich / iwioke — top">
          <span>Maxim Matsulevich</span>
          <span aria-hidden="true">/ iwioke</span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <LocaleSwitcher locale={locale} label={copy.switchLanguage} />
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? copy.closeMenu : copy.menu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="mobile-navigation" className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          {links.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              style={{"--index": index} as React.CSSProperties}
            >
              <span>0{index + 1}</span>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
