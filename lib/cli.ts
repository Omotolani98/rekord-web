/* ════════════════════════════════════════════════════════════════════
   cli.ts — rekord command tree → reference cards & search index
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

export const REKORD_CLI: CommandGroup[] = [
  {
    label: "// recording",
    commands: [
      {
        name: "start",
        purpose: "Begin a recording session in the current shell.",
        synopsis: "rekord start [--name <id>] [--tag <t>] [--timer <dur>] [--shell <sh>]",
        flags: [
          ["--name", "Human-readable session id. Auto-generated if omitted."],
          ["--tag", "Attach one or more tags for later filtering."],
          ["--timer", "Auto-stop after a duration (e.g. 5m, 90s)."],
          ["--shell", "Override the recorded shell (bash, zsh, fish)."],
        ],
      },
      {
        name: "run",
        purpose: "Record a single command without a long-lived session.",
        synopsis: 'rekord run "<command>" [--name <id>] [--tag <t>]',
        flags: [
          ["--name", "Name the one-shot session."],
          ["--tag", "Tag the recording."],
        ],
      },
      {
        name: "stop",
        purpose: "End the active session and flush it to storage.",
        synopsis: "rekord stop [--discard]",
        flags: [["--discard", "Throw away the recording instead of saving."]],
      },
    ],
  },
  {
    label: "// sessions",
    commands: [
      {
        name: "list",
        purpose: "List recorded sessions, newest first.",
        synopsis: "rekord list [--tag <t>] [--json] [--limit <n>]",
        flags: [
          ["--tag", "Filter to sessions carrying a tag."],
          ["--json", "Emit machine-readable JSON."],
          ["--limit", "Cap the number of rows returned."],
        ],
      },
      {
        name: "replay",
        purpose: "Replay a session in the terminal at recorded timing.",
        synopsis: "rekord replay <session> [--speed <x>] [--no-timing]",
        flags: [
          ["--speed", "Playback multiplier (e.g. 2 for 2×)."],
          ["--no-timing", "Print instantly, ignore recorded delays."],
        ],
      },
      {
        name: "show",
        purpose: "Print a session’s metadata and command summary.",
        synopsis: "rekord show <session> [--json]",
        flags: [["--json", "Emit the full session record as JSON."]],
      },
    ],
  },
  {
    label: "// exporting",
    commands: [
      {
        name: "export",
        purpose: "Export a session to any supported format.",
        synopsis: "rekord export <session> --to <fmt> [--output <path>] [--include-output]",
        flags: [
          ["--to", "Target: cast · markdown · json · script · gif · mp4."],
          ["--output", "Write to a specific file path."],
          ["--include-output", "Embed captured stdout/stderr in the export."],
          ["--theme", "Color theme for gif/mp4 renders."],
        ],
      },
    ],
  },
  {
    label: "// handoff",
    commands: [
      {
        name: "handoff",
        purpose: "Build an AI-ready context bundle from a session.",
        synopsis: "rekord handoff <session> [--include-output] [--include-env] [--include-diff]",
        flags: [
          ["--include-output", "Include command output in the bundle."],
          ["--include-env", "Include sanitized environment context."],
          ["--include-diff", "Include the working-tree diff at record time."],
          ["--to", "Bundle format: markdown (default) or json."],
        ],
      },
    ],
  },
  {
    label: "// security",
    commands: [
      {
        name: "scan",
        purpose: "Scan a session for secrets before you share it.",
        synopsis: "rekord scan [<session>] [--fix] [--patterns <file>]",
        flags: [
          ["--fix", "Redact matches in place with ■ markers."],
          ["--patterns", "Load additional secret patterns from a file."],
          ["--strict", "Exit non-zero if any match is found."],
        ],
      },
    ],
  },
  {
    label: "// tmux",
    commands: [
      {
        name: "tmux start",
        purpose: "Record an attached tmux session pane-by-pane.",
        synopsis: "rekord tmux start [--name <id>] [--target <pane>]",
        flags: [
          ["--name", "Name the tmux recording."],
          ["--target", "Restrict capture to a single pane."],
        ],
      },
      {
        name: "tmux capture",
        purpose: "Snapshot the current tmux pane buffers.",
        synopsis: "rekord tmux capture [--target <pane>]",
        flags: [["--target", "Pane to capture (default: active)."]],
      },
    ],
  },
  {
    label: "// skills",
    commands: [
      {
        name: "skills list",
        purpose: "List available recording skills, built-in and local.",
        synopsis: "rekord skills list [--json]",
        flags: [["--json", "Emit the skill registry as JSON."]],
      },
      {
        name: "skills run",
        purpose: "Run a named skill against a session.",
        synopsis: "rekord skills run <skill> <session> [--arg key=val]",
        flags: [["--arg", "Pass a key=value argument to the skill."]],
      },
    ],
  },
  {
    label: "// configuration",
    commands: [
      {
        name: "config",
        purpose: "Print or edit the resolved rekord configuration.",
        synopsis: "rekord config [get <key> | set <key> <val> | edit | path]",
        flags: [
          ["get", "Print a single resolved config value."],
          ["set", "Write a value to rekord.yaml."],
          ["edit", "Open rekord.yaml in $EDITOR."],
          ["path", "Print the active config file path."],
        ],
      },
      {
        name: "version",
        purpose: "Print the rekord version and build info.",
        synopsis: "rekord version [--json]",
        flags: [["--json", "Emit version, commit and build date as JSON."]],
      },
    ],
  },
];
