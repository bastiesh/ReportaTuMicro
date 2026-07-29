"use client";
import { TIPOS_INCIDENCIA_CONFIG } from "@/types";

export function LeyendaMapa() {
  return (
    <div className="absolute bottom-24 left-3 z-[1000] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl shadow-lg p-3 border border-gray-100 dark:border-gray-800 text-[11px]">
      <p className="font-bold text-gray-700 dark:text-gray-300 mb-2 text-xs">Tipos de incidencia</p>
      {Object.entries(TIPOS_INCIDENCIA_CONFIG).map(([key, config]) => (
        <div key={key} className="flex items-center gap-2 mb-1.5 last:mb-0">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: config.color }} />
          <span className="text-gray-600 dark:text-gray-400">{config.label}</span>
        </div>
      ))}
    </div>
  );
}
