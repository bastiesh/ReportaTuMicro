"use client";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { ParaderoConRutas } from "@/types";
import { Bus, MapPin, ChevronRight } from "lucide-react";
import { RouteBadge } from "@/components/ui/route-badge";

const iconoParadero = L.divIcon({
  className: "paradero-marker",
  html: `<div style="background: linear-gradient(135deg, #3b82f6, #2563eb); width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 8px rgba(59,130,246,0.4); cursor: pointer; transition: transform 0.2s;"></div>`,
  iconSize: [14, 14], iconAnchor: [7, 7],
});

export function MarcadorParadero({ paradero }: { paradero: ParaderoConRutas }) {
  // Extract unique routes from stopTimes
  const rutasUnicas = paradero.stopTimes
    ? Array.from(
        new Map(
          paradero.stopTimes.map(st => [st.trip.route.id, st.trip.route])
        ).values()
      )
    : [];

  return (
    <Marker position={[paradero.lat, paradero.lng]} icon={iconoParadero}>
      <Popup className="paradero-popup" closeButton={false}>
        <div className="p-3 min-w-[220px] font-sans">
          <div className="flex items-start gap-3 mb-2">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg flex-shrink-0">
              <Bus className="text-blue-600 dark:text-blue-400" size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 leading-tight">{paradero.nombre}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                <MapPin size={11} /> {paradero.comuna}
              </p>
            </div>
          </div>
          
          {rutasUnicas.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Servicios</p>
              <div className="flex flex-wrap gap-1.5">
                {rutasUnicas.slice(0, 5).map((route) => (
                  <RouteBadge key={route.id} route={route} size="sm" />
                ))}
                {rutasUnicas.length > 5 && (
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 px-1.5 py-0.5">
                    +{rutasUnicas.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}

          <Link href={`/paradero/${paradero.id}`}
            className="flex items-center justify-center gap-1 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-blue-600/20">
            Ver detalle <ChevronRight size={14} />
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}
