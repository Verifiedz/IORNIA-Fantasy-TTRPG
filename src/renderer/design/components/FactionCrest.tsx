// Placeholder crest for faction nodes in the Relationship Web — no real
// crest art exists yet, so this is initials in a diamond, distinct from
// the circular character portrait medallion rather than imitating one.
export function FactionCrest({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-10 w-10 rotate-45 items-center justify-center border-2 border-gold bg-night-deep">
      <span className="-rotate-45 font-display text-xs text-gold-bright">
        {initials}
      </span>
    </div>
  );
}
