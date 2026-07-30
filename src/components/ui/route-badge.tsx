import { Route } from "@/types";

interface RouteBadgeProps {
  route: Route;
  arrivalTime?: string;
  size?: "sm" | "md";
}

export function RouteBadge({ route, arrivalTime, size = "md" }: RouteBadgeProps) {
  const sizeClasses = size === "sm" 
    ? "px-2 py-0.5 text-[11px]" 
    : "px-3 py-1 text-sm";

  return (
    <div
      className={`inline-flex items-center font-bold rounded-lg ${sizeClasses}`}
      style={{
        backgroundColor: route.color,
        color: route.textColor,
      }}
    >
      {route.shortName}
      {arrivalTime && (
        <span className="ml-1.5 opacity-80">· {arrivalTime.slice(0, 5)}</span>
      )}
    </div>
  );
}
