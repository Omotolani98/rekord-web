"use client";
/* ────────────────────────────────────────────────────────────────────
   TerminalHero — looping typewriter that auto-types a real rekord session
   ──────────────────────────────────────────────────────────────────── */
import { useEffect, useRef } from "react";

type Line = { c: string } | { o: string; k: string };

const SESSION: Line[] = [
  { c: "rekord start --name monocron-demo" },
  { o: '● recording session "monocron-demo"  ·  press Ctrl-] to stop', k: "amber" },
  { c: "go test ./..." },
  { o: "ok  github.com/monocron/app  0.231s", k: "ok" },
  { c: "rekord run --name status -- git status" },
  { o: " M  internal/record/session.go", k: "out" },
  { o: "?? docs/demo.md", k: "dim" },
  { c: "rekord scan monocron-demo" },
  { o: "✓ no secrets found  ·  3 patterns checked", k: "ok" },
  { c: "rekord export monocron-demo --to markdown" },
  { o: "✓ wrote demo.md  ·  5 commands · 42 lines", k: "ok" },
  { c: "rekord handoff monocron-demo --include-git --copy" },
  { o: "✓ context bundle → handoff/context.md  ·  copied", k: "info" },
];

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function TerminalHero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = ref.current;
    if (!body) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      let html = "";
      SESSION.forEach((s) => {
        if ("c" in s)
          html += `<div class="ln"><span class="prompt">$ </span><span class="cmd">${esc(s.c)}</span></div>`;
        else html += `<div class="ln ${s.k}">${esc(s.o)}</div>`;
      });
      html += `<div class="ln"><span class="prompt">$ </span><span class="term-caret"></span></div>`;
      body.innerHTML = html;
      return;
    }

    let cancelled = false;
    const caret = document.createElement("span");
    caret.className = "term-caret";

    const wait = (ms: number) =>
      new Promise<void>((r) => {
        const id = setTimeout(r, ms);
        timers.add(id);
      });
    const timers = new Set<ReturnType<typeof setTimeout>>();

    let parked: HTMLDivElement | null = null;
    const clearParked = () => {
      if (parked) {
        parked.remove();
        parked = null;
      }
    };

    function parkCaret() {
      clearParked();
      const line = document.createElement("div");
      line.className = "ln caret-line";
      const pr = document.createElement("span");
      pr.className = "prompt";
      pr.textContent = "$ ";
      line.appendChild(pr);
      line.appendChild(caret);
      body!.appendChild(line);
      parked = line;
    }

    function typeInto(el: HTMLElement, text: string) {
      return new Promise<void>((resolve) => {
        let i = 0;
        const tick = () => {
          if (cancelled) return resolve();
          if (i >= text.length) return resolve();
          el.insertBefore(document.createTextNode(text[i++]), caret);
          const jitter = 22 + Math.random() * 36;
          const id = setTimeout(tick, jitter);
          timers.add(id);
        };
        tick();
      });
    }

    async function run() {
      while (!cancelled) {
        body!.innerHTML = "";
        parked = null;
        body!.style.opacity = "1";
        for (let i = 0; i < SESSION.length; i++) {
          if (cancelled) return;
          const s = SESSION[i];
          if ("c" in s) {
            clearParked();
            const line = document.createElement("div");
            line.className = "ln";
            const pr = document.createElement("span");
            pr.className = "prompt";
            pr.textContent = "$ ";
            const cmd = document.createElement("span");
            cmd.className = "cmd";
            line.appendChild(pr);
            line.appendChild(cmd);
            body!.appendChild(line);
            cmd.appendChild(caret);
            await typeInto(cmd, s.c);
            await wait(360);
          } else {
            await wait(150);
            const out = document.createElement("div");
            out.className = "ln " + s.k;
            out.textContent = s.o;
            body!.appendChild(out);
            parkCaret();
            await wait(120);
          }
        }
        parkCaret();
        await wait(3200);
        body!.style.transition = "opacity .6s ease";
        body!.style.opacity = "0";
        await wait(700);
      }
    }
    run();

    return () => {
      cancelled = true;
      timers.forEach((id) => clearTimeout(id));
    };
  }, []);

  return (
    <div className="term reveal" style={{ animationDelay: ".34s" }} aria-hidden="true">
      <div className="term-bar">
        <div className="term-dots">
          <i />
          <i />
          <i />
        </div>
        <div className="term-title">
          <span className="rec" /> rekord — monocron-demo
        </div>
      </div>
      <div className="term-body" ref={ref} />
      <div className="term-fx" />
    </div>
  );
}
