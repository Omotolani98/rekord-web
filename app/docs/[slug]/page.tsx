import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocNav from "@/components/DocNav";
import Toc from "@/components/Toc";
import CliReference from "@/components/CliReference";
import { EYEBROWS, GH, ORDER, PAGES, docParts, headings, slugify } from "@/lib/docs";
import { getChangelog } from "@/lib/github";

function fmtDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function generateStaticParams() {
  return ORDER.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = PAGES[slug];
  if (!title) return {};
  return { title: `${title} — rekord docs` };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = PAGES[slug];
  if (!title) notFound();

  const isCli = slug === "cli-reference";
  const isChangelog = slug === "changelog";
  const parts = docParts(slug);
  const entries = isChangelog ? await getChangelog() : null;
  const items = isChangelog
    ? (entries || []).map((e) => ({ id: slugify(e.tag), text: e.tag, level: 2 }))
    : headings(slug);

  return (
    <>
      <main className="doc-main">
        <article className="doc-article active">
          <div className="eyebrow">
            <span className="accent">//</span>&nbsp;{EYEBROWS[slug]}
          </div>
          <h1>{title}</h1>

          {isCli ? (
            <>
              <p className="lead">The complete command tree. Every command, its purpose, synopsis, and flags.</p>
              <CliReference />
            </>
          ) : isChangelog ? (
            <>
              <p className="lead">What&apos;s new in Rekord — straight from the CHANGELOG.</p>
              {entries && entries.length > 0 ? (
                entries.map((e) => (
                  <section key={e.tag}>
                    <h2 id={slugify(e.tag)}>{e.tag}</h2>
                    {e.date && (
                      <p>
                        <strong>{fmtDate(e.date)}</strong>
                      </p>
                    )}
                    <div dangerouslySetInnerHTML={{ __html: e.bodyHtml }} />
                  </section>
                ))
              ) : (
                <p>
                  Couldn&apos;t load releases right now — see them on{" "}
                  <a className="inl" href={`${GH}/releases`} target="_blank" rel="noopener">
                    GitHub
                  </a>
                  .
                </p>
              )}
            </>
          ) : parts ? (
            <>
              <p className="lead" dangerouslySetInnerHTML={{ __html: parts.lead }} />
              <div dangerouslySetInnerHTML={{ __html: parts.rest }} />
            </>
          ) : null}

          <DocNav slug={slug} />
        </article>
      </main>
      <Toc items={items} />
    </>
  );
}
