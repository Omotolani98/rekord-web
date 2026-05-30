/* ────────────────────────────────────────────────────────────────────
   DocNav — prev / next page links
   ──────────────────────────────────────────────────────────────────── */
import Link from "next/link";
import { ORDER, PAGES } from "@/lib/docs";

export default function DocNav({ slug }: { slug: string }) {
  const i = ORDER.indexOf(slug);
  const prev = ORDER[i - 1];
  const next = ORDER[i + 1];
  return (
    <nav className="doc-nav">
      {prev ? (
        <Link className="prev" href={`/docs/${prev}`}>
          <span className="dir">← prev</span>
          <span className="t">{PAGES[prev]}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link className="next" href={`/docs/${next}`}>
          <span className="dir">next →</span>
          <span className="t">{PAGES[next]}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
