interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
};

const colors = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
];

function getColor(name: string) {
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  return (
    <div
      aria-label={name}
      className={[
        "flex items-center justify-center rounded-full text-white font-semibold select-none",
        getColor(name),
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      {getInitials(name)}
    </div>
  );
}
