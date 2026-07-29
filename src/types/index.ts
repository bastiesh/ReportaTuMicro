export interface Paradero {
  id: string; gtfsStopId: string; nombre: string; lat: number; lng: number; comuna: string;
}

export interface Resena {
  id: string; paraderoId: string; texto: string; rating: number;
  reportesAbuso: number; oculta: boolean; creadoEn: string;
}

export interface Incidencia {
  id: string; tipo: "ATRASO" | "FISCALIZADOR" | "ZONA_INSEGURA" | "OTRO";
  descripcion: string; lat: number; lng: number;
  horaInicio: string | null; horaFin: string | null;
  expiraAt: string; creadoEn: string;
}

export type TipoIncidencia = Incidencia["tipo"];

export const TIPOS_INCIDENCIA_CONFIG = {
  ATRASO: { label: "Atraso", emoji: "🚌", color: "#f59e0b", bg: "bg-amber-500", text: "text-amber-600" },
  FISCALIZADOR: { label: "Fiscalizador", emoji: "👮", color: "#ef4444", bg: "bg-red-500", text: "text-red-600" },
  ZONA_INSEGURA: { label: "Zona insegura", emoji: "⚠️", color: "#7c3aed", bg: "bg-purple-600", text: "text-purple-600" },
  OTRO: { label: "Otro", emoji: "📝", color: "#6b7280", bg: "bg-gray-500", text: "text-gray-600" },
} as const;
