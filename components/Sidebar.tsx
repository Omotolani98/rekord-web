"use client";
/* ────────────────────────────────────────────────────────────────────
   Sidebar — grouped docs nav with sliding ▋ active marker + mobile drawer
   ──────────────────────────────────────────────────────────────────── */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const GROUPS: { label: string; links: [string, string][] }[] = [
  { label: "// start", links: [["getting-started", "Getting Started"]] },
  {
    label: "// record",
    links: [
      ["recording", "Recording"],
      ["sessions", "Sessions"],
    ],
  },
  {
    label: "// share",
    links: [
      ["exporting", "Exporting"],
      ["handoff", "AI Handoff"],
    ],
  },
  { label: "// safety", links: [["redaction", "Redaction & Security"]] },
  {
    label: "// power-ups",
    links: [
      ["tmux", "tmux"],
      ["skills", "Skills"],
    ],
  },
  {
    label: "// reference",
    links: [
      ["configuration", "Configuration"],
      ["cli-reference", "CLI Reference"],
      ["changelog", "Changelog"],
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onToggle = () => setOpen((v) => !v);
    window.addEventListener("rekord:toggleSidebar", onToggle);
    return () => window.removeEventListener("rekord:toggleSidebar", onToggle);
  }, []);

  // close the drawer whenever the route changes
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <aside className={"sidebar" + (open ? " open" : "")}>
        {GROUPS.map((g) => (
          <div className="sb-group" key={g.label}>
            <span className="sb-label">{g.label}</span>
            {g.links.map(([slug, title]) => (
              <Link
                key={slug}
                href={`/docs/${slug}`}
                className={"sb-link" + (pathname === `/docs/${slug}` ? " active" : "")}
              >
                {title}
              </Link>
            ))}
          </div>
        ))}
      </aside>
      <div className={"scrim" + (open ? " open" : "")} onClick={() => setOpen(false)} />
    </>
  );
}
