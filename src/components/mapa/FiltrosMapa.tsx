"use client";
import { useMapaStore } from "@/stores/mapaStore";
import { Eye, EyeOff, Bus, AlertTriangle, Moon, Sun } from "lucide-react";
import { useEffect, useRef } from "react";

export function FiltrosMapa() {
  const { filtros, setFiltros, modoOscuro, toggleModoOscuro } = useMapaStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      if (!button) return;

      const text = button.textContent || '';
      if (text.includes('Paraderos')) {
        console.log("Paraderos button clicked");
        setFiltros({ mostrarParaderos: !filtros.mostrarParaderos });
      } else if (text.includes('Incidencias')) {
        console.log("Incidencias button clicked");
        setFiltros({ mostrarIncidencias: !filtros.mostrarIncidencias });
      } else if (text.includes('Modo')) {
        console.log("Dark mode button clicked");
        toggleModoOscuro();
      }
    };

    container.addEventListener('click', handleClick, true);
    return () => container.removeEventListener('click', handleClick, true);
  }, [filtros, setFiltros, modoOscuro, toggleModoOscuro]);

  return (
    <div ref={containerRef} className="fixed top-14 left-3 z-[99999] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-xl p-3.5 min-w-[170px] border border-gray-100 dark:border-gray-800">
      <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2.5">Capas</p>
      <button
        className={`w-full flex items-center justify-start gap-2.5 mb-1.5 px-3 py-1.5 text-xs rounded-lg font-semibold transition-all duration-200 ${
          filtros.mostrarParaderos 
            ? "bg-primary-600 text-white shadow-md shadow-primary-600/20" 
            : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        {filtros.mostrarParaderos ? <Eye size={13} /> : <EyeOff size={13} />}
        <Bus size={13} /> Paraderos
      </button>
      <button
        className={`w-full flex items-center justify-start gap-2.5 px-3 py-1.5 text-xs rounded-lg font-semibold transition-all duration-200 ${
          filtros.mostrarIncidencias 
            ? "bg-primary-600 text-white shadow-md shadow-primary-600/20" 
            : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        {filtros.mostrarIncidencias ? <Eye size={13} /> : <EyeOff size={13} />}
        <AlertTriangle size={13} /> Incidencias
      </button>
      <div className="border-t border-gray-100 dark:border-gray-800 my-2.5" />
      <button
        className="w-full flex items-center justify-start gap-2.5 px-3 py-1.5 text-xs rounded-lg font-semibold transition-all duration-200 bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        {modoOscuro ? <Sun size={13} /> : <Moon size={13} />}
        {modoOscuro ? "Modo claro" : "Modo oscuro"}
      </button>
    </div>
  );
}
