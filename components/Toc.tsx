"use client";
/* ────────────────────────────────────────────────────────────────────
   Toc — on-page table of contents with scrollspy
   ──────────────────────────────────────────────────────────────────── */
import { useEffect, useState } from "react";

type Heading = { id: string; text: string; level: number };

export default function Toc({ items }: { items: Heading[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (!items.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = items.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive(en.target.id);
        });
      },
      { rootMargin: "-72px 0px -70% 0px" },
    );
    els.forEach((el) => spy.observe(el));
    void reduced;
    return () => spy.disconnect();
  }, [items]);

  if (!items.length) return <aside className="toc" />;

  const onClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = document.getElementById(id);
    if (t) {
      window.scrollTo({
        top: t.getBoundingClientRect().top + window.scrollY - 76,
        behavior: reduced ? "auto" : "smooth",
      });
      history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <aside className="toc">
      <p className="toc-label">on this page</p>
      {items.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={(h.level === 3 ? "sub" : "") + (active === h.id ? " active" : "")}
          onClick={(e) => onClick(e, h.id)}
        >
          {h.text}
        </a>
      ))}
    </aside>
  );
}
