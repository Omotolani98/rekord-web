import Link from "next/link";
import TerminalHero from "@/components/TerminalHero";
import { GH } from "@/lib/docs";

const ARROW = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const GH_ICON = (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const FEATURES: [string, string, React.ReactNode][] = [
  ["// capture", "Lossless sessions", "Commands, output, timing and exit codes are recorded as structured events — not a flat screen-scrape."],
  ["// safe", "Redaction by default", <>
    <code className="ic">rekord scan</code> catches tokens, keys and secrets before anything leaves your machine.
  </>],
  ["// handoff", "Context for agents", "Turn a real session into a clean, structured bundle your AI agent can actually reason about."],
  ["// portable", "One binary, no deps", "A single static Go executable. No runtime, no daemon, no account. Drop it on any box and record."],
  ["// replay", "Faithful playback", "Replay at recorded timing, or export to GIF and MP4 for docs, READMEs and release notes."],
  ["// local", "Yours, on disk", "Sessions live in a plain, inspectable layout under your home directory. Zero telemetry, ever."],
];

const FAN_OUTS: [string, string, string][] = [
  ["cast", "session.cast", "replayable"],
  ["md", "demo.md", "docs"],
  ["{ }", "session.json", "structured"],
  ["gif", "demo.gif", "share"],
  ["mp4", "demo.mp4", "video"],
  ["ai", "handoff.md", "context"],
];

export default function Home() {
  return (
    <main id="view-landing">
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <div className="eyebrow reveal" style={{ animationDelay: ".0s" }}>
              <span className="accent">//</span>&nbsp;open-source terminal recorder
            </div>
            <h1 className="reveal" style={{ animationDelay: ".08s" }}>
              Record what you build.
              <br />
              Export what you <span className="em">learned</span>.
            </h1>
            <p className="sub reveal" style={{ animationDelay: ".18s" }}>
              Rekord is a single Go binary that captures your terminal sessions and turns them into casts, docs, video, and AI-ready context — locally, and safe by default.
            </p>
            <div className="hero-cta reveal" style={{ animationDelay: ".28s" }}>
              <Link className="btn btn-primary" href="/docs/getting-started">
                Get started
                {ARROW}
              </Link>
              <a className="btn btn-ghost" href={GH} target="_blank" rel="noopener">
                {GH_ICON}
                View on GitHub
              </a>
            </div>
            <div className="hero-meta reveal" style={{ animationDelay: ".38s" }}>
              <span>
                <i className="dot" /> single Go binary
              </span>
              <span>
                <i className="dot" /> zero telemetry
              </span>
              <span>
                <i className="dot" /> MIT licensed
              </span>
            </div>
          </div>

          <TerminalHero />
        </div>
      </section>

      <hr className="hr" />

      {/* fan-out diagram */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">
              <span className="accent">//</span>&nbsp;01 — the core idea
            </div>
            <h2>Record once, export anywhere.</h2>
            <p>
              Every session is captured as structured, data-first events. One recording fans out into every format you need — no re-running, no re-typing.
            </p>
          </div>
          <div className="fan">
            <div className="fan-source">
              <div className="fan-node">
                <span className="k">session</span>
                <span className="v">monocron-demo</span>
                <span className="m">5 commands · 42 lines</span>
              </div>
            </div>
            <div className="fan-wires">
              <svg viewBox="0 0 100 300" preserveAspectRatio="none">
                <path vectorEffect="non-scaling-stroke" d="M0 150 C40 150 55 18 100 18" />
                <path vectorEffect="non-scaling-stroke" d="M0 150 C40 150 55 70 100 70" />
                <path vectorEffect="non-scaling-stroke" d="M0 150 C40 150 55 122 100 122" />
                <path vectorEffect="non-scaling-stroke" d="M0 150 C40 150 55 178 100 178" />
                <path vectorEffect="non-scaling-stroke" d="M0 150 C40 150 55 230 100 230" />
                <path vectorEffect="non-scaling-stroke" d="M0 150 C40 150 55 282 100 282" />
              </svg>
              <div className="fan-outs">
                {FAN_OUTS.map(([ico, ft, fd]) => (
                  <div className="fan-out" key={ft}>
                    <span className="ico">{ico}</span>
                    <span className="ft">{ft}</span>
                    <span className="fd">{fd}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* feature cards */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">
              <span className="accent">//</span>&nbsp;02 — why rekord
            </div>
            <h2>Built by terminal people, for terminal people.</h2>
          </div>
          <div className="cards">
            {FEATURES.map(([cn, h3, body]) => (
              <div className="card" key={h3}>
                <div className="cn">{cn}</div>
                <h3>{h3}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>

          <div className="band">
            <div>
              <h2>From zero to your first recording in under two minutes.</h2>
              <p>
                Install the binary, run <code className="ic">rekord start</code>, do your thing, export. That's the whole loop.
              </p>
            </div>
            <Link className="btn btn-primary" href="/docs/getting-started">
              Read the guide
              {ARROW}
            </Link>
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap foot-grid">
          <div>
            <Link className="brand" href="/">
              <b>rekord</b>
              <span className="cursor" />
            </Link>
            <p>Record what you build. Export what you learned. Handoff context to AI.</p>
          </div>
          <div>
            <h4>// docs</h4>
            <ul>
              <li><Link href="/docs/getting-started">Getting started</Link></li>
              <li><Link href="/docs/recording">Recording</Link></li>
              <li><Link href="/docs/exporting">Exporting</Link></li>
              <li><Link href="/docs/handoff">AI handoff</Link></li>
            </ul>
          </div>
          <div>
            <h4>// reference</h4>
            <ul>
              <li><Link href="/docs/cli-reference">CLI reference</Link></li>
              <li><Link href="/docs/configuration">Configuration</Link></li>
              <li><Link href="/docs/redaction">Security</Link></li>
              <li><Link href="/docs/changelog">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h4>// project</h4>
            <ul>
              <li><a href={GH} target="_blank" rel="noopener">GitHub</a></li>
              <li><a href={`${GH}/issues`} target="_blank" rel="noopener">Issues</a></li>
              <li><a href={`${GH}/releases`} target="_blank" rel="noopener">Releases</a></li>
              <li><Link href="/docs/getting-started">License — MIT</Link></li>
            </ul>
          </div>
        </div>
        <div className="wrap foot-base">
          <span>© 2026 rekord — MIT licensed</span>
          <span>
            made for the terminal <span className="cursor" style={{ height: ".8em", width: ".45ch" }} />
          </span>
        </div>
      </footer>
    </main>
  );
}
