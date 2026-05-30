"use client";
/* ────────────────────────────────────────────────────────────────────
   CommandPalette — ⌘K fuzzy search over pages, sections, commands
   ──────────────────────────────────────────────────────────────────── */
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ORDER, PAGES, headings } from "@/lib/docs";
import { REKORD_CLI } from "@/lib/cli";

type Item = {
  t: string;
  d: string;
  g: string;
  href: string;
  ic: string;
};

function buildIndex(): Item[] {
  const idx: Item[] = [];
  ORDER.forEach((id) => {
    idx.push({ t: PAGES[id], d: "page", g: "Pages", href: `/docs/${id}`, ic: "¶" });
  });
  ORDER.forEach((id) => {
    headings(id)
      .filter((h) => h.level === 2)
      .forEach((h) => {
        idx.push({ t: h.text, d: PAGES[id], g: "Sections", href: `/docs/${id}#${h.id}`, ic: "#" });
      });
  });
  REKORD_CLI.forEach((grp) => {
    grp.commands.forEach((c) => {
      idx.push({
        t: "rekord " + c.name,
        d: c.purpose,
        g: "Commands",
        href: `/docs/cli-reference#cmd-${c.name.replace(/\s+/g, "-")}`,
        ic: "$",
      });
    });
  });
  return idx;
}

function fuzzy(q: string, t: string): number {
  q = q.toLowerCase();
  t = t.toLowerCase();
  if (!q) return 1;
  if (t.indexOf(q) >= 0) return 100 - t.indexOf(q);
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) if (t[i] === q[qi]) qi++;
  return qi === q.length ? 1 : 0;
}

export default function CommandPalette() {
  const router = useRouter();
  const index = useMemo(buildIndex, []);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    return index
      .map((it) => ({ it, s: fuzzy(q, it.t + " " + it.d) }))
      .filter((m) => m.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 24)
      .map((m) => m.it);
  }, [index, q]);

  const close = useCallback(() => setOpen(false), []);
  const openPalette = useCallback(() => {
    setQ("");
    setSel(0);
    setOpen(true);
  }, []);

  const activate = useCallback(
    (it: Item | undefined) => {
      if (!it) return;
      close();
      router.push(it.href);
    },
    [close, router],
  );

  useEffect(() => setSel(0), [q]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  useEffect(() => {
    const onOpen = () => setOpen((v) => !v);
    window.addEventListener("rekord:openPalette", onOpen);
    return () => window.removeEventListener("rekord:openPalette", onOpen);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (e.key === "/" && tag !== "input" && tag !== "textarea" && !open) {
        e.preventDefault();
        openPalette();
        return;
      }
      if (!open) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSel((s) => Math.min(s + 1, matches.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSel((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        activate(matches[sel]);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, matches, sel, activate, close, openPalette]);

  useEffect(() => {
    const el = resultsRef.current?.querySelector(".palette-item.sel");
    if (el) (el as HTMLElement).scrollIntoView({ block: "nearest" });
  }, [sel]);

  let lastG = "";
  return (
    <div
      className={"palette-overlay" + (open ? " open" : "")}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="palette" role="dialog" aria-label="Search">
        <div className="palette-in">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search docs and commands…"
            autoComplete="off"
            spellCheck={false}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <span className="esc">esc</span>
        </div>
        <div className="palette-results" ref={resultsRef}>
          {matches.length === 0 ? (
            <div className="palette-empty">No matches for “{q}”</div>
          ) : (
            matches.map((it, i) => {
              const showSec = it.g !== lastG;
              lastG = it.g;
              return (
                <div key={i}>
                  {showSec && <div className="palette-sec">{it.g}</div>}
                  <div
                    className={"palette-item" + (i === sel ? " sel" : "")}
                    onClick={() => activate(it)}
                    onMouseMove={() => setSel(i)}
                  >
                    <span className="pico">{it.ic}</span>
                    <span className="pt">{it.t}</span>
                    <span className="pd">{it.d}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="palette-foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
