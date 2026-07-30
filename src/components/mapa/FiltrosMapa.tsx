"use client";
import { useMapaStore } from "@/stores/mapaStore";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Bus, AlertTriangle, Moon, Sun } from "lucide-react";

export function FiltrosMapa() {
  const { filtros, setFiltros, modoOscuro, toggleModoOscuro } = useMapaStore();

  const toggleParaderos = () => {
    console.log("Toggle paraderos:", !filtros.mostrarParaderos);
    setFiltros({ mostrarParaderos: !filtros.mostrarParaderos });
  };

  const toggleIncidencias = () => {
    console.log("Toggle incidencias:", !filtros.mostrarIncidencias);
    setFiltros({ mostrarIncidencias: !filtros.mostrarIncidencias });
  };

  const toggleDarkMode = () => {
    console.log("Toggle dark mode:", !modoOscuro);
    toggleModoOscuro();
  };

  return (
    <div className="absolute top-14 left-3 z-[1000] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-xl p-3.5 min-w-[170px] border border-gray-100 dark:border-gray-800 pointer-events-auto">
      <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2.5">Capas</p>
      <Button
        variant={filtros.mostrarParaderos ? "primary" : "secondary"}
        size="sm"
        onClick={toggleParaderos}
        className="w-full justify-start gap-2.5 mb-1.5 text-xs"
      >
        {filtros.mostrarParaderos ? <Eye size={13} /> : <EyeOff size={13} />}
        <Bus size={13} /> Paraderos
      </Button>
      <Button
        variant={filtros.mostrarIncidencias ? "primary" : "secondary"}
        size="sm"
        onClick={toggleIncidencias}
        className="w-full justify-start gap-2.5 text-xs"
      >
        {filtros.mostrarIncidencias ? <Eye size={13} /> : <EyeOff size={13} />}
        <AlertTriangle size={13} /> Incidencias
      </Button>
      <div className="border-t border-gray-100 dark:border-gray-800 my-2.5" />
      <Button variant="ghost" size="sm" onClick={toggleDarkMode} className="w-full justify-start gap-2.5 text-xs">
        {modoOscuro ? <Sun size={13} /> : <Moon size={13} />}
        {modoOscuro ? "Modo claro" : "Modo oscuro"}
      </Button>
    </div>
  );
}
