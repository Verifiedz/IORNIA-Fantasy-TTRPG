// Placeholder styling: a static bar with the 90/75/50/25 marks from
// CLAUDE.md. The animated vessel (GSAP fill/drain, honoring the motion
// setting) is a design-system-pass follow-up, not built in this pass.
const MARKS = [90, 75, 50, 25];

export function PoolBar({
  value,
  depleted,
}: {
  value: number;
  depleted?: boolean;
}) {
  return (
    <div className="relative h-5 w-full overflow-hidden rounded border border-gold/40 bg-night-deep">
      <div
        className={`h-full transition-[width] ${depleted ? "bg-blood" : "bg-gold"}`}
        style={{ width: `${value}%` }}
      />
      {MARKS.map((mark) => (
        <div
          key={mark}
          className="absolute top-0 h-full w-px bg-night/60"
          style={{ left: `${mark}%` }}
        />
      ))}
    </div>
  );
}
