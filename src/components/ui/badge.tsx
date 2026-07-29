import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
      variant === "default" && "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
      variant === "secondary" && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      variant === "outline" && "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
      className
    )}>{children}</span>
  );
}
