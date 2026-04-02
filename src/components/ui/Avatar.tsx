interface AvatarProps {
  username: string;
  size?: "sm" | "md" | "lg";
}

export default function Avatar({ username, size = "md" }: AvatarProps) {
  const sizes = { sm: "w-6 h-6 text-xs", md: "w-8 h-8 text-sm", lg: "w-12 h-12 text-lg" };
  const initial = username.charAt(0).toUpperCase();

  // Generate a consistent color from the username
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white shrink-0`}
      style={{ backgroundColor: `hsl(${hue}, 60%, 40%)` }}
    >
      {initial}
    </div>
  );
}
