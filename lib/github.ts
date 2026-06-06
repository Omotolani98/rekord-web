/* ────────────────────────────────────────────────────────────────────
   github.ts — live star count for the nav bar GitHub pill
   ──────────────────────────────────────────────────────────────────── */
const REPO = "Omotolani98/rekord";

/* fetch the repo's star count, revalidated hourly. Returns null on failure
   so the UI can degrade to just the GitHub icon. */
export async function getStars(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "rekord-web",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

/* 0 → "0", 2400 → "2.4k", 12000 → "12k" */
export function formatStars(n: number): string {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return (k >= 10 ? Math.round(k).toString() : k.toFixed(1).replace(/\.0$/, "")) + "k";
}

export type ChangelogEntry = {
  tag: string;
  date: string; // e.g. "2026-05-31"
  bodyHtml: string; // rendered markdown body for this version
};

/* escape HTML, then apply the inline markdown the changelog uses: `code` + [links] */
function inline(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/`([^`]+)`/g, '<code class="ic">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a class="inl" href="$2" target="_blank" rel="noopener">$1</a>',
    );
}

/* convert a version's body lines (### headings + bullet lists) into HTML.
   bullets may wrap onto indented continuation lines, joined into one <li>. */
function mdToHtml(lines: string[]): string {
  const out: string[] = [];
  const li: string[] = [];
  const flush = () => {
    if (li.length) {
      out.push("<ul>" + li.map((b) => `<li>${inline(b)}</li>`).join("") + "</ul>");
      li.length = 0;
    }
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      flush();
      out.push(`<h3>${inline(h3[1])}</h3>`);
      continue;
    }
    const bullet = line.match(/^\s*-\s+(.+)$/);
    if (bullet) {
      li.push(bullet[1].trim());
      continue;
    }
    // continuation of the current bullet
    if (li.length) li[li.length - 1] += " " + line.trim();
  }
  flush();
  return out.join("\n");
}

/* fetch CHANGELOG.md from main, parse into entries newest-first. null on failure. */
export async function getChangelog(): Promise<ChangelogEntry[] | null> {
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${REPO}/main/CHANGELOG.md`, {
      headers: {
        "User-Agent": "rekord-web",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const md = await res.text();
    const lines = md.split("\n");

    const entries: ChangelogEntry[] = [];
    let cur: { tag: string; date: string; body: string[] } | null = null;
    const push = () => {
      if (cur) entries.push({ tag: cur.tag, date: cur.date, bodyHtml: mdToHtml(cur.body) });
    };
    for (const line of lines) {
      const head = line.match(/^##\s+(\S+)\s+[—–-]\s+(.+?)\s*$/);
      if (head) {
        push();
        cur = { tag: head[1], date: head[2].trim(), body: [] };
        continue;
      }
      if (cur) cur.body.push(line);
    }
    push();
    return entries.length ? entries : null;
  } catch {
    return null;
  }
}
