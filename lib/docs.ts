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
<p>Rekord ships as a single static Go binary. Install it with Homebrew or <code class="ic">go install</code>, or grab a prebuilt archive from the <a class="inl" href="${GH}/releases" target="_blank" rel="noopener">Releases</a> page.</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="brew tap Omotolani98/rekord
brew install rekord"></button>
  <pre><span class="pr">$ </span><span class="ct">brew tap Omotolani98/rekord</span>   <span class="cm"># macOS / Linuxbrew</span>
<span class="pr">$ </span><span class="ct">brew install rekord</span></pre>
</div>
<div class="codeblock">
  <button class="copy-btn" data-copy="go install github.com/Omotolani98/rekord/cmd/rekord@latest"></button>
  <pre><span class="pr">$ </span><span class="ct">go install github.com/Omotolani98/rekord/cmd/rekord@latest</span>  <span class="cm"># from source</span></pre>
</div>
<p>Every install also ships <code class="ic">rk</code> — a drop-in short alias for <code class="ic">rekord</code> (<code class="ic">rk start …</code>, <code class="ic">rk version</code>). Confirm it's on your <code class="ic">PATH</code>:</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord version"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord version</span>
<span class="o">rekord v0.1.1</span></pre>
</div>

<h2>Your first recording</h2>
<ol class="doc-steps">
  <li>
    <h3>Start a session</h3>
    <p>Drop into a recorded shell. Everything you type — and everything that prints back — is captured.</p>
    <div class="codeblock">
      <button class="copy-btn" data-copy="rekord start --name monocron-demo"></button>
      <pre><span class="pr">$ </span><span class="ct">rekord start --name monocron-demo</span>
<span class="o-info">● recording session "monocron-demo" · press Ctrl-] to stop</span></pre>
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
    <p>Press the stop hotkey — <code class="ic">Ctrl-]</code> by default — to end the recording. Rekord flushes the session to disk and prints a quick summary. (Use <code class="ic">--timer 5m</code> at start for hands-free auto-stop.)</p>
    <div class="codeblock">
      <pre><span class="o-dim">^]</span>
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
  <pre><span class="pr">$ </span><span class="ct">rekord start <span class="fl">--name</span> demo</span>              <span class="cm"># begin recording</span>
<span class="pr">$ </span><span class="ct">rekord run <span class="fl">--name</span> demo -- <span class="st">make build</span></span>  <span class="cm"># record one command</span>
<span class="pr">$ </span><span class="ct">rekord list</span>                         <span class="cm"># see your sessions</span>
<span class="pr">$ </span><span class="ct">rekord replay demo</span>                  <span class="cm"># watch it back</span>
<span class="pr">$ </span><span class="ct">rekord export demo <span class="fl">--to</span> gif</span>          <span class="cm"># share it</span>
<span class="pr">$ </span><span class="ct">rekord handoff demo <span class="fl">--include-git</span></span>     <span class="cm"># bundle for AI</span></pre>
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
<p class="lead">Three ways to capture a session, depending on how much ceremony you want.</p>

<h2>Interactive sessions</h2>
<p>The default. <code class="ic">rekord start</code> wraps your shell and records everything until you press the stop hotkey (<code class="ic">Ctrl-]</code> by default).</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord start --name api-debug"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord start <span class="fl">--name</span> api-debug</span>
<span class="o-info">● recording session "api-debug" · press Ctrl-] to stop</span></pre>
</div>
<p>Change the stop key per run with <code class="ic">--stop-key ctrl-x</code>, or set a persistent default in config (<code class="ic">recording.stopKey</code>).</p>

<h2>Single commands</h2>
<p>Skip the session entirely and capture exactly one command with <code class="ic">rekord run</code>. Everything after <code class="ic">--</code> is the command to record.</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord run --name k8s -- kubectl get pods -A"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord run <span class="fl">--name</span> k8s -- <span class="st">kubectl get pods -A</span></span>
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
<p>Each recording is a self-contained directory under <code class="ic">~/.rekord/sessions/</code> (override the root with <code class="ic">--root</code>). Nothing is hidden, nothing phones home.</p>
<div class="codeblock">
  <div class="file"><span class="ft"></span>~/.rekord/sessions/&lt;id&gt;/</div>
  <pre><span class="o">~/.rekord/sessions/monocron-demo/</span>
<span class="o">├── metadata.json   </span><span class="cm"># name, timing, summary</span>
<span class="o">├── events.jsonl    </span><span class="cm"># append-only event log (output/input/resize)</span>
<span class="o">├── exports/        </span><span class="cm"># generated cast/json/markdown/script/gif/mp4</span>
<span class="o">└── handoff/        </span><span class="cm"># context.md, git.diff, tree.txt, logs.txt</span></pre>
</div>
<p>Configuration lives separately at <code class="ic">~/.rekord/rekord.yaml</code> — see <a class="inl" href="/docs/configuration">Configuration</a>.</p>

<h2>Finding sessions</h2>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord list"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord list</span>
<span class="o">NAME            COMMANDS  WHEN</span>
<span class="o">api-debug       12        2h ago</span>
<span class="o">monocron-demo   5         yesterday</span></pre>
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
  <button class="copy-btn" data-copy="rekord export monocron-demo --to markdown -o demo.md"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord export monocron-demo <span class="fl">--to</span> markdown <span class="fl">-o</span> demo.md</span>
<span class="o-ok">✓ wrote demo.md · 5 commands · 42 lines</span></pre>
</div>

<h2>GIF &amp; video</h2>
<p>Render the session to an animated GIF or MP4, complete with recorded timing. MP4 takes a <code class="ic">--size</code> preset (<code class="ic">720p</code> or <code class="ic">1080p</code>).</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord export monocron-demo --to gif -o docs/demo.gif"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord export monocron-demo <span class="fl">--to</span> gif <span class="fl">-o</span> docs/demo.gif</span>
<span class="o-ok">✓ rendered docs/demo.gif · 1.8 MB · 12s</span></pre>
</div>
<div class="callout note">
  <div class="ch">▋ note</div>
  <p>GIF/MP4 export needs <code class="ic">agg</code> installed (and <code class="ic">ffmpeg</code> for MP4). Run <code class="ic">rekord doctor</code> to check what's available.</p>
</div>

<h2>Redacting on export</h2>
<p>Pass <code class="ic">--redact</code> to strip secrets from any export, or <code class="ic">--no-redact</code> to override a config default. Your recorded source files are never modified — redaction only touches the generated output.</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord export monocron-demo --to markdown --redact"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord export monocron-demo <span class="fl">--to</span> markdown <span class="fl">--redact</span></span>
<span class="o-ok">✓ wrote demo.md · 2 secrets redacted</span></pre>
</div>`,

  handoff: `
<p class="lead">Turn a real terminal session into a clean, structured context bundle an AI agent can actually reason about.</p>

<h2>Build a bundle</h2>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord handoff monocron-demo --include-git --copy"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord handoff monocron-demo <span class="fl">--include-git</span> <span class="fl">--copy</span></span>
<span class="o-ok">✓ context bundle → handoff/context.md · copied to clipboard</span></pre>
</div>

<h2>What goes in</h2>
<p>A handoff bundle is curated, not a raw dump. <code class="ic">context.md</code> holds the session story; flags add optional context alongside it under <code class="ic">handoff/</code>:</p>
<ul>
  <li><code class="ic">--include-git</code> — git status and diff at record time (<code class="ic">git.diff</code>).</li>
  <li><code class="ic">--include-tree</code> — a repository tree snapshot (<code class="ic">tree.txt</code>).</li>
  <li><code class="ic">--include-logs</code> — the captured session logs (<code class="ic">logs.txt</code>).</li>
  <li><code class="ic">--copy</code> — copy the context straight to your clipboard.</li>
</ul>

<div class="callout security">
  <div class="ch">▋ security</div>
  <p>Handoff bundles are designed to be pasted into a chat or agent. Always <code class="ic">rekord scan</code> before sharing context that touched credentials.</p>
</div>`,

  redaction: `
<p class="lead">Rekord is safe by default. A dedicated scanner reports secrets before anything leaves your machine, and redaction happens on export — your recorded source files are never modified.</p>

<h2>Scan a session</h2>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord scan monocron-demo"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord scan monocron-demo</span>
<span class="o-ok">✓ no secrets found · 3 patterns checked</span></pre>
</div>
<p>When something matches, Rekord tells you exactly where. Add <code class="ic">--strict</code> to exit non-zero so a scan can gate a CI step or a pre-share hook.</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord scan monocron-demo --strict"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord scan monocron-demo <span class="fl">--strict</span></span>
<span class="o-err">! AWS key matched · event 14 · stdout</span>
<span class="o-err">✗ 1 secret found (exit 1)</span></pre>
</div>

<h2>Redact on export</h2>
<p>Scanning only reports. To actually strip secrets, redact when you export or hand off — the generated output is cleaned while the raw session stays intact.</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord export monocron-demo --to markdown --redact"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord export monocron-demo <span class="fl">--to</span> markdown <span class="fl">--redact</span></span>
<span class="o-ok">✓ wrote demo.md · 1 secret redacted → ■■■■■■■■■■</span></pre>
</div>

<div class="callout security">
  <div class="ch">▋ security</div>
  <p>Turn redaction on by default in config (<code class="ic">privacy.redact: true</code>) and add your own <code class="ic">privacy.redactPatterns</code>. Use <code class="ic">--no-redact</code> to override per export.</p>
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
<p class="lead">Skills are reusable YAML recording recipes. Instead of typing the same setup every time, you <code class="ic">run</code> a skill and Rekord records the session it describes. A few starters ship built-in.</p>

<h2>List skills</h2>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord skills list"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord skills list</span>
<span class="o">go-test      record a Go test run</span>
<span class="o">build        record a clean project build</span>
<span class="o">demo         scripted walkthrough recording</span></pre>
</div>

<h2>Run a skill</h2>
<p>Running a skill executes its recipe and records the result as a normal session.</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord skills run go-test --name nightly"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord skills run go-test <span class="fl">--name</span> nightly</span>
<span class="o-ok">✓ recorded "nightly" from skill go-test</span></pre>
</div>
<div class="callout tip">
  <div class="ch">▋ tip</div>
  <p>Skills are just YAML files. Drop your own under <code class="ic">.rekord/skills/</code> (or point <code class="ic">--skills-dir</code> elsewhere) and they show up in <code class="ic">rekord skills list</code> automatically.</p>
</div>`,

  configuration: `
<p class="lead">Rekord works with zero config. When you want to tune command extraction, redaction, or the stop hotkey, everything lives in one readable <code class="ic">rekord.yaml</code>.</p>

<h2>rekord.yaml</h2>
<p>By default Rekord reads <code class="ic">~/.rekord/rekord.yaml</code>, falling back to a <code class="ic">./rekord.yaml</code> in the current directory if present. <code class="ic">--config &lt;path&gt;</code> overrides either. Values merge over the built-in defaults.</p>
<div class="codeblock">
  <div class="file"><span class="ft"></span>~/.rekord/rekord.yaml</div>
  <button class="copy-btn"></button>
  <pre><span class="st">commands:</span>
  <span class="st">promptPatterns:</span>
    <span class="o">- "^❯\\s+(.+)$"</span>      <span class="cm"># how to detect a prompt in output</span>

<span class="st">privacy:</span>
  <span class="st">redact:</span> true            <span class="cm"># redact on export by default</span>
  <span class="st">redactPatterns:</span>
    <span class="o">- "mytoken-[0-9]+"</span>

<span class="st">recording:</span>
  <span class="st">stopKey:</span> <span class="o">"ctrl-]"</span>       <span class="cm"># hotkey to stop an interactive session</span></pre>
</div>

<h2>Read &amp; write values</h2>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord config set recording.stopKey ctrl-x"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord config get privacy.redact</span>
<span class="o">true</span>
<span class="pr">$ </span><span class="ct">rekord config set recording.stopKey ctrl-x</span>
<span class="o-ok">✓ recording.stopKey = ctrl-x</span>
<span class="pr">$ </span><span class="ct">rekord config view</span>           <span class="cm"># print the merged config</span>
<span class="pr">$ </span><span class="ct">rekord config path</span>           <span class="cm"># print the resolved file path</span></pre>
</div>
<div class="callout note">
  <div class="ch">▋ note</div>
  <p>Config resolves in order: built-in defaults → <code class="ic">rekord.yaml</code> → command-line flags. Flags always win.</p>
</div>`,

  /* changelog is rendered dynamically from the repo CHANGELOG.md — see
     app/docs/[slug]/page.tsx + lib/github.ts getChangelog() */
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
