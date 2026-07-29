"use client";
import { Bus } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2.5 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2">
        <Bus size={20} className="flex-shrink-0" />
        <h1 className="text-[15px] font-bold tracking-tight">ReportaTuMicro</h1>
      </div>
      <span className="text-[10px] font-semibold bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">DEMO</span>
    </header>
  );
}
