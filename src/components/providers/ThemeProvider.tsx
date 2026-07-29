"use client";
import { useEffect } from "react";
import { useMapaStore } from "@/stores/mapaStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { modoOscuro } = useMapaStore();

  useEffect(() => {
    if (modoOscuro) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [modoOscuro]);

  return <>{children}</>;
}
