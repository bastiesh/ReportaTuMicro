"use client";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Incidencia, TIPOS_INCIDENCIA_CONFIG } from "@/types";
import { formatTimeAgo } from "@/lib/validaciones";
import { Clock } from "lucide-react";

const iconoIncidencia = (tipo: string) => {
  const config = TIPOS_INCIDENCIA_CONFIG[tipo as keyof typeof TIPOS_INCIDENCIA_CONFIG] || TIPOS_INCIDENCIA_CONFIG.OTRO;
  return L.divIcon({
    className: "incidencia-marker",
    html: `<div style="background: ${config.color}; width: 18px; height: 18px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.35); animation: pulse-marker 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; cursor: pointer;"></div>`,
    iconSize: [18, 18], iconAnchor: [9, 9],
  });
};

export function MarcadorIncidencia({ incidencia }: { incidencia: Incidencia }) {
  const config = TIPOS_INCIDENCIA_CONFIG[incidencia.tipo] || TIPOS_INCIDENCIA_CONFIG.OTRO;
  return (
    <Marker position={[incidencia.lat, incidencia.lng]} icon={iconoIncidencia(incidencia.tipo)}>
      <Popup className="incidencia-popup" closeButton={false}>
        <div className="p-3 max-w-[260px] font-sans">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold text-white mb-2 ${config.bg}`}>
            <span>{config.emoji}</span> {config.label}
          </span>
          <p className="text-sm text-gray-800 dark:text-gray-200 mb-2 font-medium leading-snug">{incidencia.descripcion}</p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <Clock size={11} /> {formatTimeAgo(new Date(incidencia.creadoEn))}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}
