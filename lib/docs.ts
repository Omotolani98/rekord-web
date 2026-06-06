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
  memory: "Memory",
  redaction: "Redaction & Security",
  tmux: "tmux",
  skills: "Skills",
  mcp: "Live agent control (MCP)",
  "persistent-sessions": "Persistent sessions",
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
  memory: "memory",
  redaction: "redaction & security",
  tmux: "tmux",
  skills: "skills",
  mcp: "live agent control",
  "persistent-sessions": "persistent sessions",
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
</div>

<div class="callout note">
  <div class="ch">▋ see also</div>
  <p><a class="inl" href="/docs/mcp">Live agent control (MCP)</a> is the live counterpart to handoff — handoff bundles a session after the fact; MCP drives and records it as it happens. <a class="inl" href="/docs/memory">Memory</a> carries durable context across sessions and agents.</p>
</div>`,

  memory: `
<p class="lead">Rekord Memory is a user-local shared memory layer for humans and coding agents. It lets agents remember what happened, what changed, what failed, and where work should continue, even after a terminal closes or a different agent takes over.</p>

<div class="callout note">
  <div class="ch">▋ since 0.3.0</div>
  <p>Rekord remains a terminal workflow recorder; Memory adds persistent project continuity on top.</p>
</div>

<h2>The problem</h2>
<p>Coding agents lose context across sessions. Claude, Codex, Cursor, OpenCode, Goose, Aider, and other agents each keep their own short-lived view of work. When users switch tools, close terminals, or hand off from one agent to another, useful context disappears.</p>
<p>Git remembers code history. Rekord remembers work history.</p>

<h2>What Memory adds</h2>
<ul>
  <li>Durable project memories</li>
  <li>Git-aware snapshots with full patches</li>
  <li>Agent-to-agent handoff</li>
  <li>Resume context for interrupted work</li>
  <li>Named session linkage</li>
  <li>MCP tools so agents can read and write memory directly</li>
</ul>
<p>Memory is stored locally by default under:</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="~/.rekord/projects/&lt;project-hash&gt;/"></button>
  <pre><span class="o">~/.rekord/projects/&lt;project-hash&gt;/</span></pre>
</div>
<p>Rekord does not write memory files into your repository by default.</p>

<h2>Core workflow</h2>
<p>Store something important:</p>
<div class="codeblock">
  <button class="copy-btn" data-copy='rekord remember "Parser refactor stopped at the failing unicode fixture"'></button>
  <pre><span class="pr">$ </span><span class="ct">rekord remember <span class="st">"Parser refactor stopped at the failing unicode fixture"</span></span></pre>
</div>
<p>Capture a stopping point:</p>
<div class="codeblock">
  <button class="copy-btn" data-copy='rekord snapshot "Implemented parser refactor; tests still failing"'></button>
  <pre><span class="pr">$ </span><span class="ct">rekord snapshot <span class="st">"Implemented parser refactor; tests still failing"</span></span></pre>
</div>
<p>Search project memory and resume later:</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord recall parser
rekord resume"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord recall parser</span>
<span class="pr">$ </span><span class="ct">rekord resume</span></pre>
</div>

<h2>Agent-to-agent handoff</h2>
<p>Memory can scope context by agent. If Claude started the work:</p>
<div class="codeblock">
  <button class="copy-btn" data-copy='rekord snapshot --agent=claude "Stopped at failing refresh-token test"'></button>
  <pre><span class="pr">$ </span><span class="ct">rekord snapshot <span class="fl">--agent</span>=claude <span class="st">"Stopped at failing refresh-token test"</span></span></pre>
</div>
<p>Codex, OpenCode, or another agent can continue from Claude's context:</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord resume --from-agent=claude --to-agent=codex"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord resume <span class="fl">--from-agent</span>=claude <span class="fl">--to-agent</span>=codex</span></pre>
</div>
<p>The output includes the latest snapshot, relevant memories, changed files, patch files, blockers, and continuation context.</p>

<h2>Named sessions</h2>
<p>Agents can name Rekord sessions and tell users how to resume them.</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="memory-mvp-claude"></button>
  <pre><span class="o">memory-mvp-claude</span></pre>
</div>
<p>Store memory and create snapshots linked to that session:</p>
<div class="codeblock">
  <button class="copy-btn" data-copy='rekord remember --agent=claude --session=memory-mvp-claude "Auth middleware refactor is incomplete"
rekord snapshot --agent=claude --session=memory-mvp-claude "Stopped after debugging token expiry"'></button>
  <pre><span class="pr">$ </span><span class="ct">rekord remember <span class="fl">--agent</span>=claude <span class="fl">--session</span>=memory-mvp-claude <span class="st">"Auth middleware refactor is incomplete"</span></span>
<span class="pr">$ </span><span class="ct">rekord snapshot <span class="fl">--agent</span>=claude <span class="fl">--session</span>=memory-mvp-claude <span class="st">"Stopped after debugging token expiry"</span></span></pre>
</div>
<p>Resume from that exact session:</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord resume --session=memory-mvp-claude"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord resume <span class="fl">--session</span>=memory-mvp-claude</span></pre>
</div>

<h2>Git-aware snapshots</h2>
<p><code class="ic">rekord snapshot</code> captures the current branch, current HEAD, dirty status, changed files, full unstaged patch, and full staged patch.</p>
<p>Patch files are written locally under:</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="~/.rekord/projects/&lt;project-hash&gt;/patches/"></button>
  <pre><span class="o">~/.rekord/projects/&lt;project-hash&gt;/patches/</span></pre>
</div>
<p>This makes snapshots useful for review, recovery, and handoff.</p>

<h2>Commands</h2>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord remember &lt;text&gt;
rekord recall [query]
rekord resume
rekord snapshot [note]"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord remember &lt;text&gt;</span>
<span class="pr">$ </span><span class="ct">rekord recall [query]</span>
<span class="pr">$ </span><span class="ct">rekord resume</span>
<span class="pr">$ </span><span class="ct">rekord snapshot [note]</span></pre>
</div>
<p>Full memory management:</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord memory add &lt;text&gt;
rekord memory list
rekord memory search &lt;query&gt;
rekord memory show &lt;id&gt;
rekord memory resolve &lt;id&gt;"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord memory add &lt;text&gt;</span>
<span class="pr">$ </span><span class="ct">rekord memory list</span>
<span class="pr">$ </span><span class="ct">rekord memory search &lt;query&gt;</span>
<span class="pr">$ </span><span class="ct">rekord memory show &lt;id&gt;</span>
<span class="pr">$ </span><span class="ct">rekord memory resolve &lt;id&gt;</span></pre>
</div>

<h2>MCP tools</h2>
<table class="flags">
  <thead><tr><th>tool</th><th>purpose</th></tr></thead>
  <tbody>
    <tr><td class="f">memory_write</td><td class="d">Persist a project memory.</td></tr>
    <tr><td class="f">memory_search</td><td class="d">Search project memory.</td></tr>
    <tr><td class="f">memory_list</td><td class="d">List memories.</td></tr>
    <tr><td class="f">memory_get</td><td class="d">Read one memory by id.</td></tr>
    <tr><td class="f">memory_resolve</td><td class="d">Mark a memory or blocker resolved.</td></tr>
    <tr><td class="f">snapshot_create</td><td class="d">Capture git-aware project state.</td></tr>
    <tr><td class="f">resume_context</td><td class="d">Return latest snapshot, relevant memories, changed files, patches, blockers, and continuation context.</td></tr>
  </tbody>
</table>

<h2>Positioning</h2>
<p>Memory makes Rekord the continuity layer for agentic development:</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="Record what happened.
Snapshot where work stopped.
Remember what matters.
Resume with the next agent."></button>
  <pre><span class="o">Record what happened.</span>
<span class="o">Snapshot where work stopped.</span>
<span class="o">Remember what matters.</span>
<span class="o">Resume with the next agent.</span></pre>
</div>

<div class="callout note">
  <div class="ch">▋ see also</div>
  <p><a class="inl" href="/docs/handoff">AI Handoff</a> bundles a single session after the fact; Memory is the durable layer across sessions and agents. <a class="inl" href="/docs/mcp">Live agent control (MCP)</a> exposes the memory tools to agents directly.</p>
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

  mcp: `
<p class="lead"><code class="ic">rekord mcp</code> runs a <a class="inl" href="https://modelcontextprotocol.io" target="_blank" rel="noopener">Model Context Protocol</a> server over stdio. An AI agent (Claude Code, Cursor, …) launches terminal programs, sends input, waits for output, and reads a <strong>deterministic screen frame</strong> — instead of guessing from a raw byte stream. Every agent session is also recorded, so you can <code class="ic">export</code>, <code class="ic">replay</code>, and <code class="ic">handoff</code> it afterward.</p>

<h2>Start the server</h2>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord mcp"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord mcp</span></pre>
</div>
<table class="flags">
  <thead><tr><th>flag</th><th>default</th><th>description</th></tr></thead>
  <tbody>
    <tr><td class="f">--root</td><td class="d">~/.rekord/sessions</td><td class="d">Where sessions are recorded.</td></tr>
    <tr><td class="f">--config</td><td class="d">~/.rekord/rekord.yaml</td><td class="d">Config file (redaction patterns).</td></tr>
    <tr><td class="f">--no-redact</td><td class="d">false</td><td class="d">Disable redaction of captures and logs.</td></tr>
  </tbody>
</table>

<h2>Register with Claude Code</h2>
<div class="codeblock">
  <button class="copy-btn" data-copy="claude mcp add rekord -- rekord mcp"></button>
  <pre><span class="pr">$ </span><span class="ct">claude mcp add rekord -- rekord mcp</span></pre>
</div>
<p>Or add it to your MCP client config:</p>
<div class="codeblock">
  <button class="copy-btn" data-copy='{
  "mcpServers": {
    "rekord": { "command": "rekord", "args": ["mcp"] }
  }
}'></button>
  <pre>{
  <span class="st">"mcpServers"</span>: {
    <span class="st">"rekord"</span>: { <span class="st">"command"</span>: <span class="o">"rekord"</span>, <span class="st">"args"</span>: [<span class="o">"mcp"</span>] }
  }
}</pre>
</div>

<h2>Tools</h2>
<table class="flags">
  <thead><tr><th>tool</th><th>purpose</th></tr></thead>
  <tbody>
    <tr><td class="f">launch</td><td class="d">Start a program in a new session (<code class="ic">name</code>, <code class="ic">command</code>, <code class="ic">cols</code>, <code class="ic">rows</code>, <code class="ic">cwd</code>, <code class="ic">env</code>).</td></tr>
    <tr><td class="f">send</td><td class="d">Send <code class="ic">text</code> and/or named <code class="ic">keys</code> (<code class="ic">enter</code>, <code class="ic">tab</code>, <code class="ic">esc</code>, <code class="ic">ctrl-c</code>, arrows, …).</td></tr>
    <tr><td class="f">capture</td><td class="d">Return the current screen frame (grid + cursor). <code class="ic">raw: true</code> for unredacted text.</td></tr>
    <tr><td class="f">wait_text</td><td class="d">Block until the screen contains <code class="ic">text</code>, the process exits, or <code class="ic">timeoutMs</code> elapses.</td></tr>
    <tr><td class="f">wait_idle</td><td class="d">Block until output is quiet for <code class="ic">quietMs</code>.</td></tr>
    <tr><td class="f">wait_exit</td><td class="d">Block until the process exits.</td></tr>
    <tr><td class="f">logs</td><td class="d">Return the retained output transcript (<code class="ic">maxBytes</code>, <code class="ic">raw</code>).</td></tr>
    <tr><td class="f">resize</td><td class="d">Resize the terminal viewport.</td></tr>
    <tr><td class="f">stop</td><td class="d">Terminate a session and finalize its recording.</td></tr>
    <tr><td class="f">list / status</td><td class="d">Inspect active and finished sessions.</td></tr>
  </tbody>
</table>
<p>Every wait returns a <code class="ic">reason</code>: <code class="ic">matched</code>, <code class="ic">idle</code>, <code class="ic">exited</code>, or <code class="ic">deadline</code>.</p>

<h3>Memory tools</h3>
<p><a class="inl" href="/docs/memory">Rekord Memory</a> adds tools so agents can read and write persistent project memory and resume interrupted work.</p>
<table class="flags">
  <thead><tr><th>tool</th><th>purpose</th></tr></thead>
  <tbody>
    <tr><td class="f">memory_write</td><td class="d">Persist a project memory.</td></tr>
    <tr><td class="f">memory_search</td><td class="d">Search project memory.</td></tr>
    <tr><td class="f">memory_list</td><td class="d">List memories.</td></tr>
    <tr><td class="f">memory_get</td><td class="d">Read one memory by id.</td></tr>
    <tr><td class="f">memory_resolve</td><td class="d">Mark a memory or blocker resolved.</td></tr>
    <tr><td class="f">snapshot_create</td><td class="d">Capture git-aware project state.</td></tr>
    <tr><td class="f">resume_context</td><td class="d">Return latest snapshot, relevant memories, changed files, patches, blockers, and continuation context.</td></tr>
  </tbody>
</table>

<h2>Example flow</h2>
<ol>
  <li><code class="ic">launch</code> — <code class="ic">{ "name": "build", "command": ["npm", "run", "dev"] }</code></li>
  <li><code class="ic">wait_text</code> — <code class="ic">{ "name": "build", "text": "ready in", "timeoutMs": 30000 }</code></li>
  <li><code class="ic">capture</code> — <code class="ic">{ "name": "build" }</code> → inspect the frame</li>
  <li><code class="ic">stop</code> — <code class="ic">{ "name": "build" }</code></li>
</ol>

<div class="callout security">
  <div class="ch">▋ privacy</div>
  <p><code class="ic">capture</code> and <code class="ic">logs</code> are redacted with your configured patterns by default. Pass <code class="ic">raw: true</code> (or start the server with <code class="ic">--no-redact</code>) only when you need the unredacted screen — transcripts may contain secrets.</p>
</div>`,

  "persistent-sessions": `
<p class="lead"><code class="ic">rekord session</code> runs a named terminal program as a <strong>detached background session</strong> reachable over an owner-only unix socket (<code class="ic">&lt;root&gt;/&lt;name&gt;.sock</code>, mode <code class="ic">0600</code>). Any later command — from any process — drives the same live session. The session keeps its final screen after the program exits, until you <code class="ic">stop</code> it. Like all rekord sessions, it is recorded for <code class="ic">export</code> / <code class="ic">replay</code> / <code class="ic">handoff</code>.</p>

<h2>Lifecycle</h2>
<p>Launch a detached session:</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord session start --name demo --cols 80 --rows 24 -- htop"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord session start <span class="fl">--name</span> demo <span class="fl">--cols</span> 80 <span class="fl">--rows</span> 24 -- <span class="st">htop</span></span></pre>
</div>
<p>Drive it from separate commands:</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord session status --name demo"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord session status <span class="fl">--name</span> demo</span>
<span class="pr">$ </span><span class="ct">rekord session send   <span class="fl">--name</span> demo <span class="st">"q"</span></span>
<span class="pr">$ </span><span class="ct">rekord session send   <span class="fl">--name</span> demo <span class="fl">--key</span> ctrl-c</span>
<span class="pr">$ </span><span class="ct">rekord session show   <span class="fl">--name</span> demo</span>            <span class="cm"># current screen (text)</span>
<span class="pr">$ </span><span class="ct">rekord session show   <span class="fl">--name</span> demo <span class="fl">--format</span> json</span>
<span class="pr">$ </span><span class="ct">rekord session wait   <span class="fl">--name</span> demo <span class="fl">--text</span> <span class="st">"Done"</span> <span class="fl">--timeout</span> 30s</span>
<span class="pr">$ </span><span class="ct">rekord session wait   <span class="fl">--name</span> demo <span class="fl">--idle</span> 500ms</span>
<span class="pr">$ </span><span class="ct">rekord session wait   <span class="fl">--name</span> demo <span class="fl">--exit</span></span></pre>
</div>
<p>Inspect and tear down:</p>
<div class="codeblock">
  <button class="copy-btn" data-copy="rekord session list"></button>
  <pre><span class="pr">$ </span><span class="ct">rekord session list</span>
<span class="pr">$ </span><span class="ct">rekord session stop <span class="fl">--name</span> demo</span></pre>
</div>

<h2>Commands</h2>
<table class="flags">
  <thead><tr><th>command</th><th>description</th></tr></thead>
  <tbody>
    <tr><td class="f">start</td><td class="d">Launch a detached session after <code class="ic">--</code>. Flags: <code class="ic">--name</code>, <code class="ic">--cols</code>, <code class="ic">--rows</code>, <code class="ic">--cwd</code>.</td></tr>
    <tr><td class="f">send</td><td class="d">Send text (positional) and/or <code class="ic">--key</code> (repeatable).</td></tr>
    <tr><td class="f">show</td><td class="d">Print the current frame (<code class="ic">--format text|json</code>).</td></tr>
    <tr><td class="f">wait</td><td class="d"><code class="ic">--text</code>, <code class="ic">--idle &lt;dur&gt;</code>, or <code class="ic">--exit</code>; <code class="ic">--timeout</code>.</td></tr>
    <tr><td class="f">status / list</td><td class="d">Show one or all running sessions.</td></tr>
    <tr><td class="f">stop</td><td class="d">Terminate and finalize the recording.</td></tr>
  </tbody>
</table>
<p>All commands accept <code class="ic">--root</code> (default <code class="ic">~/.rekord/sessions</code>).</p>

<div class="callout note">
  <div class="ch">▋ note</div>
  <p>Recorded under <code class="ic">--root</code> like any session, so afterward: <code class="ic">rekord export &lt;id&gt; --to markdown</code>, <code class="ic">rekord replay &lt;id&gt;</code>, <code class="ic">rekord handoff &lt;id&gt;</code>.</p>
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
