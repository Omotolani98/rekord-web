/* ════════════════════════════════════════════════════════════════════
   docs.ts — page registry + article content (ported from rekord.html)
   ════════════════════════════════════════════════════════════════════ */

export const GH = "https://github.com/Omotolani98/rekord";

export const PAGES: Record<string, string> = {
  "getting-started": "Getting Started",
  recording: "Recording",
  sessions: "Sessions",
  exporting: "Exporting",
  handoff: "AI Handoff",
  redaction: "Redaction & Security",
  tmux: "tmux",
  skills: "Skills",
  configuration: "Configuration",
  "cli-reference": "CLI Reference",
  changelog: "Changelog",
};

export const ORDER = Object.keys(PAGES);

export const EYEBROWS: Record<string, string> = {
  "getting-started": "getting started",
  recording: "recording",
  sessions: "sessions",
  exporting: "exporting",
  handoff: "ai handoff",
  redaction: "redaction & security",
  tmux: "tmux",
  skills: "skills",
  configuration: "configuration",
  "cli-reference": "cli reference",
  changelog: "changelog",
};

/* slugify a heading's text into a stable, hash-friendly id */
export function slugify(s: string): string {
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* inject id attributes on h2/h3 so native hash scroll, the on-page TOC,
   and ⌘K section anchors all line up */
function injectHeadingIds(html: string): string {
  return html.replace(
    /<(h2|h3)>([\s\S]*?)<\/\1>/g,
    (_m, tag, inner) => `<${tag} id="${slugify(inner)}">${inner}</${tag}>`,
  );
}

/* extract { id, text, level } for each h2/h3 — used by the search index */
export function headings(slug: string): { id: string; text: string; level: number }[] {
  const html = RAW[slug];
  if (!html) return [];
  const out: { id: string; text: string; level: number }[] = [];
  const re = /<(h2|h3)>([\s\S]*?)<\/\1>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    out.push({
      id: slugify(m[2]),
      text: m[2].replace(/<[^>]*>/g, "").replace(/&amp;/g, "&"),
      level: m[1] === "h3" ? 3 : 2,
    });
  }
  return out;
}

/* ── raw article bodies (everything inside <article>, minus the doc-nav) ── */
const RAW: Record<string, string> = {
  "getting-started": `
<p class="lead">Install Rekord, capture your first session, and learn the handful of commands that cover 90% of day-to-day use.</p>

<h2>Install</h2>
<p>Rekord ships as a single static binary. Grab it with the install script, Homebrew, or <code class="ic">go install</code>.</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="curl -fsSL https://rekord.sh/install | sh"></button>
  <pre><span class="pr">$ </span><span class="ct">curl -fsSL https://rekord.sh/install | sh</span>
<span class="o-ok">✓ installed rekord 0.6.0 → /usr/local/bin/rekord</span></pre>
</div>
<div class="codeblock">
  <button class="copy-btn" data-copy="brew install rekord"></button>
  <pre><span class="pr">$ </span><span class="ct">brew install rekord</span>          <span class="cm"># macOS / Linuxbrew</span>
<span class="pr">$ </span><span class="ct">go install github.com/Omotolani98/rekord@latest</span>  <span class="cm"># from source</span></pre>
</div>
<p>Confirm it's on your <code class="ic">PATH</code>:</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord version"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord version</span>
<span class="o">rekord 0.6.0 · commit a1b2c3d · go1.22</span></pre>
</div>

<h2>Your first recording</h2>
<ol class="doc-steps">
  <li>
    <h3>Start a session</h3>
    <p>Drop into a recorded shell. Everything you type — and everything that prints back — is captured.</p>
    <div class="codeblock">
      <button class="copy-btn" data-copy="rekord start --name monocron-demo"></button>
      <pre><span class="pr">$ </span><span class="ct">rekord start --name monocron-demo</span>
<span class="o-info">● recording session "monocron-demo" · press ⌥⇧R to stop</span></pre>
    </div>
  </li>
  <li>
    <h3>Do your work</h3>
    <p>Run commands as you normally would. Rekord records the command, its output, exit code and timing.</p>
    <div class="codeblock">
      <button class="copy-btn" data-copy="go test ./..."></button>
      <pre><span class="pr">$ </span><span class="ct">go test ./...</span>
<span class="o-ok">ok  github.com/monocron/app  0.231s</span></pre>
    </div>
  </li>
  <li>
    <h3>Stop the session</h3>
    <p>End the recording. Rekord flushes the session to disk and prints a quick summary.</p>
    <div class="codeblock">
      <button class="copy-btn" data-copy="rekord stop"></button>
      <pre><span class="pr">$ </span><span class="ct">rekord stop</span>
<span class="o-ok">✓ saved "monocron-demo" · 5 commands · 12.4s</span></pre>
    </div>
  </li>
  <li>
    <h3>Export it</h3>
    <p>Turn the session into whatever you need. Markdown for docs, a cast for replay, a bundle for your agent.</p>
    <div class="codeblock">
      <button class="copy-btn" data-copy="rekord export monocron-demo --to markdown"></button>
      <pre><span class="pr">$ </span><span class="ct">rekord export monocron-demo <span class="fl">--to</span> markdown</span>
<span class="o-ok">✓ wrote demo.md · 5 commands · 42 lines</span></pre>
    </div>
  </li>
</ol>

<div class="callout tip">
  <div class="ch">▋ tip</div>
  <p>Prefer one-shots? <code class="ic">rekord run "go build ./..."</code> records a single command without starting a long-lived session.</p>
</div>

<h2>The commands you'll actually use</h2>
<p>Most workflows live inside these. The <a class="inl" href="/docs/cli-reference">CLI Reference</a> documents every flag.</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord start --name demo"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord start <span class="fl">--name</span> demo</span>     <span class="cm"># begin recording</span>
<span class="pr">$ </span><span class="ct">rekord run "<span class="st">make build</span>"</span>     <span class="cm"># record one command</span>
<span class="pr">$ </span><span class="ct">rekord list</span>                <span class="cm"># see your sessions</span>
<span class="pr">$ </span><span class="ct">rekord replay demo</span>         <span class="cm"># watch it back</span>
<span class="pr">$ </span><span class="ct">rekord export demo <span class="fl">--to</span> gif</span> <span class="cm"># share it</span>
<span class="pr">$ </span><span class="ct">rekord handoff demo</span>        <span class="cm"># bundle for AI</span></pre>
</div>

<div class="callout security">
  <div class="ch">▋ security</div>
  <p>Before sharing anything, run <code class="ic">rekord scan</code>. Rekord redacts common secret shapes by default, but a scan is your last line of defense — see <a class="inl" href="/docs/redaction">Redaction &amp; Security</a>.</p>
</div>

<h2>Next steps</h2>
<ul>
  <li><a class="inl" href="/docs/recording">Recording</a> — timer mode, single commands, and recording etiquette.</li>
  <li><a class="inl" href="/docs/exporting">Exporting</a> — every output format and when to reach for it.</li>
  <li><a class="inl" href="/docs/handoff">AI Handoff</a> — build context bundles your agent can use.</li>
</ul>`,

  recording: `
<p class="lead">Four ways to capture a session, depending on how much ceremony you want.</p>

<h2>Interactive sessions</h2>
<p>The default. <code class="ic">rekord start</code> wraps your shell and records until you stop it.</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord start --name api-debug --tag backend"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord start <span class="fl">--name</span> api-debug <span class="fl">--tag</span> backend</span>
<span class="o-info">● recording session "api-debug"</span></pre>
</div>

<h2>Single commands</h2>
<p>Skip the session entirely and capture exactly one command with <code class="ic">rekord run</code>.</p>
<div class="codeblock">
  <button class="copy-btn" data-copy='rekord run "kubectl get pods -A"'></button>
  <pre><span class="pr">$ </span><span class="ct">rekord run "<span class="st">kubectl get pods -A</span>"</span>
<span class="o-ok">✓ recorded one-shot · 1 command · 0.4s</span></pre>
</div>

<h2>Timer mode</h2>
<p>Hand-free demos: record for a fixed window, then auto-stop.</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord start --name walkthrough --timer 5m"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord start <span class="fl">--name</span> walkthrough <span class="fl">--timer</span> 5m</span>
<span class="o-info">● recording · auto-stop in 05:00</span></pre>
</div>

<div class="callout note">
  <div class="ch">▋ note</div>
  <p>Rekord records the <strong>command, output, exit code and timing</strong> as structured events — never a flat screen-scrape. That's what makes every export format possible from a single capture.</p>
</div>

<div class="callout warning">
  <div class="ch">▋ warning</div>
  <p>Interactive TUIs (vim, htop, full-screen menus) are captured as raw terminal output. They replay faithfully but don't decompose into clean command/output pairs.</p>
</div>`,

  sessions: `
<p class="lead">How Rekord models a recording, where it lives on disk, and how to find your way back to it.</p>

<h2>The session model</h2>
<p>A session is metadata plus an ordered list of <strong>events</strong>. Each event carries a relative timestamp, a stream label, and its payload — the same shape that drives replay and every export.</p>

<h2>Storage layout</h2>
<p>Sessions live in a plain, inspectable directory under your home. Nothing is hidden, nothing phones home.</p>
<div class="codeblock">
  <div class="file"><span class="ft"></span>~/.rekord/</div>
  <pre><span class="o">~/.rekord/</span>
<span class="o">├── config/        </span><span class="cm"># rekord.yaml</span>
<span class="o">└── sessions/</span>
<span class="o">    └── monocron-demo/</span>
<span class="o">        ├── metadata.json   </span><span class="cm"># name, tags, timing</span>
<span class="o">        ├── session.cast    </span><span class="cm"># the event stream</span>
<span class="o">        └── exports/        </span><span class="cm"># generated artifacts</span></pre>
</div>

<h2>Finding sessions</h2>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord list --tag backend"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord list <span class="fl">--tag</span> backend</span>
<span class="o">NAME        TAGS      COMMANDS  WHEN</span>
<span class="o">api-debug   backend   12        2h ago</span>
<span class="o">monocron-demo         5         yesterday</span></pre>
</div>
<div class="callout tip">
  <div class="ch">▋ tip</div>
  <p>Replay a session at the timing you recorded it — or speed it up: <code class="ic">rekord replay api-debug --speed 2</code>.</p>
</div>`,

  exporting: `
<p class="lead">One session, every format. Reach for <code class="ic">rekord export</code> with a <code class="ic">--to</code> target.</p>

<h2>Formats at a glance</h2>
<table class="flags">
  <thead><tr><th>--to</th><th>output</th><th>use it for</th></tr></thead>
  <tbody>
    <tr><td class="f">cast</td><td class="d">session.cast</td><td class="d">faithful, replayable recording</td></tr>
    <tr><td class="f">markdown</td><td class="d">demo.md</td><td class="d">READMEs, tutorials, docs</td></tr>
    <tr><td class="f">json</td><td class="d">session.json</td><td class="d">pipelines &amp; tooling</td></tr>
    <tr><td class="f">script</td><td class="d">replay.sh</td><td class="d">a runnable shell script</td></tr>
    <tr><td class="f">gif</td><td class="d">demo.gif</td><td class="d">embeds &amp; chat</td></tr>
    <tr><td class="f">mp4</td><td class="d">demo.mp4</td><td class="d">release videos</td></tr>
  </tbody>
</table>

<h2>Markdown</h2>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord export monocron-demo --to markdown --include-output"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord export monocron-demo <span class="fl">--to</span> markdown <span class="fl">--include-output</span></span>
<span class="o-ok">✓ wrote demo.md · 5 commands · 42 lines</span></pre>
</div>

<h2>GIF &amp; video</h2>
<p>Render the session to an animated GIF or MP4, complete with recorded timing.</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord export monocron-demo --to gif --output docs/demo.gif"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord export monocron-demo <span class="fl">--to</span> gif <span class="fl">--output</span> docs/demo.gif</span>
<span class="o-ok">✓ rendered docs/demo.gif · 1.8 MB · 12s</span></pre>
</div>
<div class="callout note">
  <div class="ch">▋ note</div>
  <p>Add <code class="ic">--include-output</code> to embed captured stdout/stderr in text exports. For <code class="ic">cast</code> and video, output is always part of the stream.</p>
</div>`,

  handoff: `
<p class="lead">Turn a real terminal session into a clean, structured context bundle an AI agent can actually reason about.</p>

<h2>Build a bundle</h2>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord handoff monocron-demo --include-output --include-diff"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord handoff monocron-demo <span class="fl">--include-output</span> <span class="fl">--include-diff</span></span>
<span class="o-ok">✓ context bundle → handoff.md · ready for your agent</span></pre>
</div>

<h2>What goes in</h2>
<p>A handoff bundle is curated, not a raw dump. You choose what context matters:</p>
<ul>
  <li><code class="ic">--include-output</code> — the actual command output, not just the commands.</li>
  <li><code class="ic">--include-env</code> — sanitized, relevant environment context.</li>
  <li><code class="ic">--include-diff</code> — the working-tree diff captured at record time.</li>
</ul>

<div class="callout security">
  <div class="ch">▋ security</div>
  <p>Handoff bundles are designed to be pasted into a chat or agent. They run through redaction first — but always <code class="ic">rekord scan</code> before sharing context that touched credentials.</p>
</div>`,

  redaction: `
<p class="lead">Rekord is safe by default. Secrets are caught on the way in, and you get a dedicated scanner before anything leaves your machine.</p>

<h2>Scan a session</h2>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord scan monocron-demo"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord scan monocron-demo</span>
<span class="o-ok">✓ no secrets found · 3 patterns checked</span></pre>
</div>
<p>When something does match, Rekord tells you exactly where — and <code class="ic">--fix</code> redacts it in place.</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord scan monocron-demo --fix"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord scan monocron-demo <span class="fl">--fix</span></span>
<span class="o-err">! AWS key matched · event 14 · stdout</span>
<span class="o-ok">✓ redacted 1 match → ■■■■■■■■■■</span></pre>
</div>

<div class="callout security">
  <div class="ch">▋ security</div>
  <p>Redaction runs <strong>before</strong> a session is written to disk. The scanner is your second pass — designed for the moment right before you export, share, or hand off.</p>
</div>

<h2>Privacy rules</h2>
<ul>
  <li>Everything stays local. There is no account, no sync, and <strong>zero telemetry</strong>.</li>
  <li>Sessions are plain files under <code class="ic">~/.rekord/</code> — inspect or delete them anytime.</li>
  <li>Add <code class="ic">~/.rekord/</code> to your global <code class="ic">.gitignore</code> so recordings never land in a repo by accident.</li>
</ul>`,

  tmux: `
<p class="lead">Record an attached tmux session, capture pane buffers, and export them like any other recording.</p>

<h2>Record a tmux session</h2>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord tmux start --name infra"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord tmux start <span class="fl">--name</span> infra</span>
<span class="o-info">● attached · recording 2 panes</span></pre>
</div>

<h2>Capture &amp; export</h2>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord tmux capture --target 0.1"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord tmux capture <span class="fl">--target</span> 0.1</span>
<span class="o-ok">✓ captured pane 0.1 · 84 lines</span>
<span class="pr">$ </span><span class="ct">rekord export infra <span class="fl">--to</span> markdown</span>
<span class="o-ok">✓ wrote infra.md</span></pre>
</div>
<div class="callout note">
  <div class="ch">▋ note</div>
  <p>tmux mode records each pane as its own event stream, so multi-pane workflows stay legible in exports instead of collapsing into one column.</p>
</div>`,

  skills: `
<p class="lead">Skills are reusable transforms that turn a raw session into something purpose-built — a tutorial, a bug report, a runbook.</p>

<h2>List skills</h2>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord skills list"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord skills list</span>
<span class="o">tutorial     turn a session into a step-by-step guide</span>
<span class="o">bug-report   format a session as a reproducible report</span>
<span class="o">runbook      extract commands into an ops runbook</span></pre>
</div>

<h2>Run a skill</h2>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord skills run tutorial monocron-demo"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord skills run tutorial monocron-demo</span>
<span class="o-ok">✓ tutorial.md · 4 steps</span></pre>
</div>
<div class="callout tip">
  <div class="ch">▋ tip</div>
  <p>Skills are just files. Drop your own under <code class="ic">~/.rekord/skills/</code> and they show up in <code class="ic">rekord skills list</code> automatically.</p>
</div>`,

  configuration: `
<p class="lead">Rekord works with zero config. When you want to tune it, everything lives in one readable <code class="ic">rekord.yaml</code>.</p>

<h2>rekord.yaml</h2>
<div class="codeblock">
  <div class="file"><span class="ft"></span>~/.rekord/config/rekord.yaml</div>
  <button class="copy-btn"></button>
  <pre><span class="st">recording:</span>
  <span class="st">shell:</span> auto            <span class="cm"># auto · bash · zsh · fish</span>
  <span class="st">capture_output:</span> true
  <span class="st">timer:</span> <span class="o">""</span>              <span class="cm"># e.g. 5m for default auto-stop</span>

<span class="st">redaction:</span>
  <span class="st">enabled:</span> true
  <span class="st">patterns:</span>
    <span class="o">- aws_access_key</span>
    <span class="o">- github_token</span>
    <span class="o">- private_key</span>

<span class="st">export:</span>
  <span class="st">default_format:</span> markdown
  <span class="st">include_output:</span> true
  <span class="st">theme:</span> phosphor          <span class="cm"># gif/mp4 color theme</span></pre>
</div>

<h2>Read &amp; write values</h2>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord config set export.default_format gif"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord config get redaction.enabled</span>
<span class="o">true</span>
<span class="pr">$ </span><span class="ct">rekord config set export.default_format gif</span>
<span class="o-ok">✓ export.default_format = gif</span></pre>
</div>
<div class="callout note">
  <div class="ch">▋ note</div>
  <p>Config resolves in order: built-in defaults → <code class="ic">rekord.yaml</code> → environment variables → command-line flags. Flags always win.</p>
</div>`,

  /* changelog is rendered dynamically from live GitHub Releases — see
     app/docs/[slug]/page.tsx + lib/github.ts getReleases() */
};

/* article split into the lead paragraph (rendered as a direct child of
   .doc-article so the `> .lead` rule applies) + the remaining body html,
   both with heading ids injected. Returns null for slugs with no raw body
   (e.g. cli-reference, which is rendered by a component). */
export function docParts(slug: string): { lead: string; rest: string } | null {
  const raw = RAW[slug];
  if (raw == null) return null;
  const html = injectHeadingIds(raw);
  const m = html.match(/<p class="lead">([\s\S]*?)<\/p>/);
  return {
    lead: m ? m[1] : "",
    rest: m ? html.replace(m[0], "") : html,
  };
}
