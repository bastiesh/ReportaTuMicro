"use client";
import { useState, useEffect } from "react";

export function useOnboarding() {
  const [visto, setVisto] = useState(true);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const v = localStorage.getItem("onboarding-visto");
    setVisto(v === "true");
    setCargando(false);
  }, []);

  const marcarVisto = () => {
    localStorage.setItem("onboarding-visto", "true");
    setVisto(true);
  };

  return { visto, cargando, marcarVisto };
}
