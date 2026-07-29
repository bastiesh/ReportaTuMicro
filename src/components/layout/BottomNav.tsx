"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Bus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  if (pathname?.startsWith("/paradero/")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1000] bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 px-6 py-2 flex justify-around items-center safe-area-pb">
      <Link href="/" className={cn("flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors", pathname === "/" ? "text-primary-600" : "text-gray-400 dark:text-gray-500")}>
        <Map size={22} strokeWidth={pathname === "/" ? 2.5 : 2} />
        Mapa
      </Link>
      <Link href="/onboarding" className={cn("flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors", pathname === "/onboarding" ? "text-primary-600" : "text-gray-400 dark:text-gray-500")}>
        <Bus size={22} strokeWidth={pathname === "/onboarding" ? 2.5 : 2} />
        Ayuda
      </Link>
    </nav>
  );
}
