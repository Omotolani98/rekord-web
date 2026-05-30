"use client";
/* ────────────────────────────────────────────────────────────────────
   TopBar — brand · nav · ⌘K trigger · GitHub · theme toggle · mobile menu
   ──────────────────────────────────────────────────────────────────── */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GH } from "@/lib/docs";
import { formatStars } from "@/lib/github";

const SUN = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2v2.4M12 19.6V22M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
  </svg>
);
const MOON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z" />
  </svg>
);

function applyTheme(t: "dark" | "light") {
  const root = document.documentElement;
  root.classList.add("no-trans");
  root.setAttribute("data-theme", t);
  void root.offsetWidth; // flush so new values apply with transitions off
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("no-trans")));
  try {
    localStorage.setItem("rekord-theme", t);
  } catch {}
}

export default function TopBar({ stars }: { stars: number | null }) {
  const pathname = usePathname();
  const inDocs = pathname.startsWith("/docs");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setTheme((document.documentElement.getAttribute("data-theme") as "dark" | "light") || "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  };

  return (
    <header className="topbar">
      <div
        className="menu-btn icon-btn"
        aria-label="Menu"
        onClick={() => window.dispatchEvent(new CustomEvent("rekord:toggleSidebar"))}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </div>
      <Link className="brand" href="/">
        <b>rekord</b>
        <span className="cursor" />
      </Link>
      <nav className="topnav">
        <Link href="/docs/getting-started" className={inDocs ? "active" : ""}>
          docs
        </Link>
        <Link href="/docs/cli-reference" className={inDocs ? "active" : ""}>
          cli
        </Link>
        <Link href="/docs/changelog" className={inDocs ? "active" : ""}>
          changelog
        </Link>
      </nav>
      <div className="topbar-right">
        <div
          className="search-trigger"
          role="button"
          tabIndex={0}
          aria-label="Search"
          onClick={() => window.dispatchEvent(new CustomEvent("rekord:openPalette"))}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") window.dispatchEvent(new CustomEvent("rekord:openPalette"));
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 15, height: 15 }}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
          <span className="stxt">Search</span>
          <span className="kbd">⌘K</span>
        </div>
        <a className="gh-pill" href={GH} target="_blank" rel="noopener">
          <svg viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          {stars != null && (
            <span className="stars">
              ★ <b>{formatStars(stars)}</b>
            </span>
          )}
        </a>
        <div className="icon-btn" role="button" tabIndex={0} aria-label="Toggle theme" onClick={toggle}>
          {theme === "dark" ? SUN : MOON}
        </div>
      </div>
    </header>
  );
}
