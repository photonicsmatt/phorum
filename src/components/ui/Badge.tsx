interface BadgeProps {
  label: string;
  color: string;
  size?: "sm" | "md";
}

export default function Badge({ label, color, size = "sm" }: BadgeProps) {
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`${sizeClasses} rounded-full font-medium inline-flex items-center`}
      style={{
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      {label}
    </span>
  );
}
