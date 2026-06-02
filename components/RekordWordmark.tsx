/* ────────────────────────────────────────────────────────────────────
   RekordWordmark — the full `rekord` lockup
   Terminal frame + ❯ prompt chevron + monospace `rekord` + record dot
   breaking the corner. Frame/chevron/text use currentColor; the record
   dot is the only accent.
   ──────────────────────────────────────────────────────────────────── */

export default function RekordWordmark({
  height = 24,
  className,
}: {
  height?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      height={height}
      width={(height * 270) / 116}
      viewBox="0 0 270 116"
      role="img"
      aria-label="rekord"
    >
      <rect
        x="8"
        y="20"
        width="232"
        height="74"
        rx="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="6.5"
      />
      <path
        d="M28 46 l13 11 -13 11"
        fill="none"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.42"
      />
      <text
        x="54"
        y="70"
        fontFamily="var(--font-mono)"
        fontSize="42"
        fontWeight="600"
        letterSpacing="-1.5"
        fill="currentColor"
      >
        rekord
      </text>
      <circle cx="240" cy="94" r="14.5" fill="var(--accent)" />
    </svg>
  );
}
