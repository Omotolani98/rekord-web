"use client";
/* ────────────────────────────────────────────────────────────────────
   CopyEnhancer — populates .copy-btn icons + handles copy via delegation
   (the article HTML ships empty <button class="copy-btn"> placeholders)
   ──────────────────────────────────────────────────────────────────── */
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const COPY_ICO =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
const DONE_ICO =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

export default function CopyEnhancer() {
  const pathname = usePathname();

  // (re)populate icons whenever the rendered article changes
  useEffect(() => {
    document.querySelectorAll<HTMLButtonElement>(".copy-btn").forEach((b) => {
      if (!b.dataset.init) {
        b.dataset.init = "1";
        b.innerHTML = COPY_ICO + "<span>copy</span>";
      }
    });
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(".copy-btn");
      if (!btn) return;
      const block = btn.closest(".codeblock") || btn.closest(".cli-card");
      const pre = block ? block.querySelector("pre, .syn") : null;
      const text =
        btn.dataset.copy ||
        (pre ? (pre as HTMLElement).innerText.replace(/^\s*✓.*$/gm, "").trim() : "");
      const done = () => {
        btn.classList.add("done");
        btn.innerHTML = DONE_ICO + "<span>copied</span>";
        setTimeout(() => {
          btn.classList.remove("done");
          btn.innerHTML = COPY_ICO + "<span>copy</span>";
        }, 1500);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done);
      else done();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
