/* ════════════════════════════════════════════════════════════════════
   cli.ts — rekord command tree → reference cards & search index
   Mirrors the real cobra commands in internal/cli/*.go (v0.1.x).
   ════════════════════════════════════════════════════════════════════ */
export type Command = {
  name: string;
  purpose: string;
  synopsis: string;
  flags: [string, string][];
};
export type CommandGroup = {
  label: string;
  commands: Command[];
};

/* Most commands also accept these. Listed once here instead of on every card. */
export const COMMON_FLAGS: [string, string][] = [
  ["--root", "Sessions directory (default ~/.rekord/sessions)."],
  ["--config", "Config file path (default ~/.rekord/rekord.yaml)."],
];

export const REKORD_CLI: CommandGroup[] = [
  {
    label: "// recording",
    commands: [
      {
        name: "start",
        purpose: "Record an interactive terminal session in the current shell.",
        synopsis: "rekord start --name <id> [--timer <dur>] [--stop-key <key>] [--shell <sh>] [--cwd <dir>]",
        flags: [
          ["--name", "Recording name (required)."],
          ["--timer", "Auto-stop after a duration (e.g. 40s, 5m)."],
          ["--stop-key", "Hotkey to stop recording (e.g. ctrl-x); overrides config."],
          ["--shell", "Shell to record (default: $SHELL)."],
          ["--cwd", "Working directory for the recorded shell."],
        ],
      },
      {
        name: "run",
        purpose: "Record a single command without a long-lived session.",
        synopsis: "rekord run --name <id> -- <command> [args...]",
        flags: [
          ["--name", "Recording name (required)."],
          ["--cwd", "Working directory for the recorded command."],
        ],
      },
    ],
  },
  {
    label: "// sessions",
    commands: [
      {
        name: "list",
        purpose: "List recorded sessions, newest first.",
        synopsis: "rekord list [--root <dir>]",
        flags: [["--root", "Sessions directory to list."]],
      },
      {
        name: "replay",
        purpose: "Replay a recorded session in the terminal with original timing.",
        synopsis: "rekord replay <session> [--speed <x>]",
        flags: [["--speed", "Playback speed multiplier (default 1.0)."]],
      },
      {
        name: "commands",
        purpose: "Show the commands extracted from a recorded session.",
        synopsis: "rekord commands <session> [--json]",
        flags: [["--json", "Emit the extracted commands as JSON."]],
      },
    ],
  },
  {
    label: "// exporting",
    commands: [
      {
        name: "export",
        purpose: "Export a recorded session to any supported format.",
        synopsis: "rekord export <session> [--to <fmt>] [-o <path>] [--redact]",
        flags: [
          ["--to", "Format: cast · json · markdown · script · gif · mp4 (default cast)."],
          ["-o, --output", "Write to a specific file path."],
          ["--size", "mp4 size preset: 720p or 1080p (default 720p)."],
          ["--redact", "Redact secrets in the export."],
          ["--no-redact", "Disable redaction even if enabled in config."],
        ],
      },
    ],
  },
  {
    label: "// handoff",
    commands: [
      {
        name: "handoff",
        purpose: "Generate an AI-ready context bundle from a session.",
        synopsis: "rekord handoff <session> [--include-git] [--include-tree] [--include-logs] [--copy]",
        flags: [
          ["--include-git", "Include git status and diff context."],
          ["--include-tree", "Include a repository tree snapshot."],
          ["--include-logs", "Include captured session logs."],
          ["--copy", "Copy the context to the clipboard."],
        ],
      },
    ],
  },
  {
    label: "// memory",
    commands: [
      {
        name: "remember",
        purpose: "Store a durable project memory for later agents or sessions.",
        synopsis: "rekord remember <text> [--agent <name>] [--session <id>]",
        flags: [
          ["--agent", "Agent name to associate with the memory."],
          ["--session", "Named Rekord session to link this memory to."],
        ],
      },
      {
        name: "recall",
        purpose: "Search project memory.",
        synopsis: "rekord recall [query] [--agent <name>]",
        flags: [["--agent", "Limit results to memories from one agent."]],
      },
      {
        name: "resume",
        purpose: "Print continuation context from the latest relevant project memory and snapshot.",
        synopsis: "rekord resume [--agent <name>] [--from-agent <name>] [--to-agent <name>] [--session <id>]",
        flags: [
          ["--agent", "Resume context for one agent."],
          ["--from-agent", "Read context created by another agent."],
          ["--to-agent", "Format handoff context for the next agent."],
          ["--session", "Resume from a named Rekord session."],
        ],
      },
      {
        name: "snapshot",
        purpose: "Capture a git-aware stopping point with changed files and full patches.",
        synopsis: "rekord snapshot [note] [--agent <name>] [--session <id>]",
        flags: [
          ["--agent", "Agent name to associate with the snapshot."],
          ["--session", "Named Rekord session to link this snapshot to."],
        ],
      },
      {
        name: "memory add",
        purpose: "Add a project memory using the full memory command namespace.",
        synopsis: "rekord memory add <text>",
        flags: [],
      },
      {
        name: "memory list",
        purpose: "List project memories.",
        synopsis: "rekord memory list",
        flags: [],
      },
      {
        name: "memory search",
        purpose: "Search project memories.",
        synopsis: "rekord memory search <query>",
        flags: [],
      },
      {
        name: "memory show",
        purpose: "Show one project memory by id.",
        synopsis: "rekord memory show <id>",
        flags: [],
      },
      {
        name: "memory resolve",
        purpose: "Mark a memory or blocker resolved.",
        synopsis: "rekord memory resolve <id>",
        flags: [],
      },
    ],
  },
  {
    label: "// security",
    commands: [
      {
        name: "scan",
        purpose: "Scan a session for possible secrets before you share it.",
        synopsis: "rekord scan <session> [--strict]",
        flags: [["--strict", "Exit non-zero if any secrets are found."]],
      },
    ],
  },
  {
    label: "// tmux",
    commands: [
      {
        name: "tmux status",
        purpose: "Show whether the current shell is inside tmux.",
        synopsis: "rekord tmux status",
        flags: [],
      },
      {
        name: "tmux capture",
        purpose: "Capture a tmux pane's current contents as a session.",
        synopsis: "rekord tmux capture --pane <pane> --name <id>",
        flags: [
          ["--pane", "tmux pane or session target (required)."],
          ["--name", "Recording name (required)."],
        ],
      },
      {
        name: "tmux record",
        purpose: "Stream a tmux pane into a recording via pipe-pane.",
        synopsis: "rekord tmux record --pane <pane> --name <id>",
        flags: [
          ["--pane", "tmux pane or session target (required)."],
          ["--name", "Recording name (required)."],
        ],
      },
      {
        name: "tmux start",
        purpose: "Create a tmux session, record it, and attach.",
        synopsis: "rekord tmux start --session <name>",
        flags: [["--session", "tmux session name (required)."]],
      },
    ],
  },
  {
    label: "// skills",
    commands: [
      {
        name: "skills list",
        purpose: "List available recording recipes, built-in and local.",
        synopsis: "rekord skills list [--skills-dir <dir>]",
        flags: [["--skills-dir", "Local skills directory (default .rekord/skills)."]],
      },
      {
        name: "skills run",
        purpose: "Run a skill recipe and record it as a session.",
        synopsis: "rekord skills run <skill> [--name <id>] [--skills-dir <dir>]",
        flags: [
          ["--name", "Recording name (defaults to the skill name)."],
          ["--skills-dir", "Local skills directory (default .rekord/skills)."],
        ],
      },
    ],
  },
  {
    label: "// ai & automation",
    commands: [
      {
        name: "mcp",
        purpose: "Run a Model Context Protocol server over stdio so AI agents can drive terminals.",
        synopsis: "rekord mcp [--root <dir>] [--config <path>] [--no-redact]",
        flags: [
          ["--root", "Sessions directory (default ~/.rekord/sessions)."],
          ["--config", "Config file with redaction patterns."],
          ["--no-redact", "Disable redaction of captures and logs."],
        ],
      },
      {
        name: "session start",
        purpose: "Launch a detached, named background session reachable over a unix socket.",
        synopsis: "rekord session start --name <id> [--cols <n>] [--rows <n>] [--cwd <dir>] -- <command> [args...]",
        flags: [
          ["--name", "Session name (required)."],
          ["--cols", "Terminal width in columns."],
          ["--rows", "Terminal height in rows."],
          ["--cwd", "Working directory for the program."],
        ],
      },
      {
        name: "session send",
        purpose: "Send text and/or named keys to a running session.",
        synopsis: "rekord session send --name <id> [text] [--key <key>]...",
        flags: [
          ["--name", "Session name (required)."],
          ["--key", "Named key to send (e.g. enter, ctrl-c); repeatable."],
        ],
      },
      {
        name: "session show",
        purpose: "Print the current screen frame of a session.",
        synopsis: "rekord session show --name <id> [--format text|json]",
        flags: [
          ["--name", "Session name (required)."],
          ["--format", "Output format: text or json (default text)."],
        ],
      },
      {
        name: "session wait",
        purpose: "Block until a session matches text, goes idle, or exits.",
        synopsis: "rekord session wait --name <id> [--text <s>] [--idle <dur>] [--exit] [--timeout <dur>]",
        flags: [
          ["--name", "Session name (required)."],
          ["--text", "Wait until the screen contains this text."],
          ["--idle", "Wait until output is quiet for a duration."],
          ["--exit", "Wait until the process exits."],
          ["--timeout", "Give up after a duration."],
        ],
      },
      {
        name: "session status",
        purpose: "Show the state of one running session.",
        synopsis: "rekord session status --name <id>",
        flags: [["--name", "Session name (required)."]],
      },
      {
        name: "session list",
        purpose: "List all running detached sessions.",
        synopsis: "rekord session list",
        flags: [],
      },
      {
        name: "session stop",
        purpose: "Terminate a session and finalize its recording.",
        synopsis: "rekord session stop --name <id>",
        flags: [["--name", "Session name (required)."]],
      },
    ],
  },
  {
    label: "// system",
    commands: [
      {
        name: "config",
        purpose: "View and edit the resolved rekord configuration.",
        synopsis: "rekord config [get <key> | set <key> <val> | view | path]",
        flags: [
          ["get", "Print a config value (recording.stopKey, privacy.redact)."],
          ["set", "Set a config value, creating rekord.yaml if needed."],
          ["view", "Print the merged configuration."],
          ["path", "Print the resolved config file path."],
        ],
      },
      {
        name: "doctor",
        purpose: "Check for optional external tools (agg for gif, ffmpeg for mp4).",
        synopsis: "rekord doctor",
        flags: [],
      },
      {
        name: "version",
        purpose: "Print the Rekord version.",
        synopsis: "rekord version",
        flags: [],
      },
    ],
  },
];
