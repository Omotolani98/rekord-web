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

export type Release = {
  tag: string;
  name: string;
  date: string; // ISO published_at
  url: string;
};

/* fetch published releases, newest first, revalidated hourly. null on failure. */
export async function getReleases(): Promise<Release[] | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=20`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "rekord-web",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      tag_name?: string;
      name?: string;
      published_at?: string;
      html_url?: string;
      draft?: boolean;
    }[];
    if (!Array.isArray(data)) return null;
    return data
      .filter((r) => !r.draft)
      .map((r) => ({
        tag: r.tag_name || r.name || "",
        name: r.name || r.tag_name || "",
        date: r.published_at || "",
        url: r.html_url || `https://github.com/${REPO}/releases`,
      }));
  } catch {
    return null;
  }
}
