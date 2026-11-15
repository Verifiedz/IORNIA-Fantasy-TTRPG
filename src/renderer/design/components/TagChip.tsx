export function TagChip({
  tag,
  onClick,
  active,
}: {
  tag: string;
  onClick?: () => void;
  active?: boolean;
}) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      onClick={onClick}
      className={`rounded-full border px-2 py-0.5 text-xs ${
        active
          ? "border-gold bg-gold/20 text-gold-bright"
          : "border-gold/30 text-gold hover:bg-gold/10"
      }`}
    >
      {tag}
    </Tag>
  );
}
