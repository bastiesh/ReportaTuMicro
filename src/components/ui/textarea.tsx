import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(
      "flex w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 resize-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500",
      className
    )} {...props} />
  )
);
Textarea.displayName = "Textarea";
