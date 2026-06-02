/* ────────────────────────────────────────────────────────────────────
   RekordMark — the compact `rk` brand mark
   Terminal frame + monospace `rk` + record dot breaking the corner.
   Frame & text use currentColor (inverts cleanly across themes);
   the record dot is the only accent.
   ──────────────────────────────────────────────────────────────────── */

export default function RekordMark({
  size = 22,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="rekord"
    >
      <rect
        x="12"
        y="18"
        width="66"
        height="62"
        rx="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="6.5"
      />
      <text
        x="22.5"
        y="60.5"
        fontFamily="var(--font-mono)"
        fontSize="40"
        fontWeight="700"
        letterSpacing="-2"
        fill="currentColor"
      >
        rk
      </text>
      <circle cx="78" cy="80" r="13" fill="var(--accent)" />
    </svg>
  );
}
