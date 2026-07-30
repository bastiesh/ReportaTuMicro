"use client";

import { useState, useEffect } from "react";
import { useMapaStore } from "@/stores/mapaStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useGeolocation } from "@/hooks/useGeolocation";
import { validarRangoHorario, contieneNombrePropio } from "@/lib/validaciones";
import { TIPOS_INCIDENCIA_CONFIG } from "@/types";
import { MapPin, Clock, AlertCircle, X, Navigation } from "lucide-react";
import { toast } from "sonner";

export default function FormularioIncidencia() {
  const { centro, setPanelAbierto } = useMapaStore();
  const { lat, lng, loading: geoLoading, error: geoError, granted, obtenerUbicacion } = useGeolocation();
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [usarRango, setUsarRango] = useState(false);
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [reportLat, setReportLat] = useState(centro.lat);
  const [reportLng, setReportLng] = useState(centro.lng);
  const [enviando, setEnviando] = useState(false);

  // Automatically use current location when available
  useEffect(() => {
    if (lat && lng) {
      setReportLat(lat);
      setReportLng(lng);
    }
  }, [lat, lng]);

  // Get location on mount
  useEffect(() => {
    obtenerUbicacion();
  }, []);

  const handleUbicacion = () => {
    obtenerUbicacion();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipo) { toast.error("Selecciona un tipo de incidencia"); return; }
    if (!descripcion.trim()) { toast.error("Escribe una descripción"); return; }
    if (contieneNombrePropio(descripcion)) { toast.error("No incluyas nombres de personas"); return; }

    if (usarRango) {
      if (!horaInicio || !horaFin) { toast.error("Define ambos horarios"); return; }
      const val = validarRangoHorario(horaInicio, horaFin);
      if (!val.valido) { toast.error(val.error); return; }
    }

    setEnviando(true);
    const body: any = { tipo, descripcion, lat: reportLat, lng: reportLng };
    if (usarRango && horaInicio && horaFin) {
      const hoy = new Date().toISOString().split("T")[0];
      body.horaInicio = `${hoy}T${horaInicio}:00.000Z`;
      body.horaFin = `${hoy}T${horaFin}:00.000Z`;
    }

    try {
      const res = await fetch("/api/incidencias", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success("¡Incidencia reportada!");
        setTipo(""); setDescripcion(""); setUsarRango(false); setHoraInicio(""); setHoraFin("");
        setTimeout(() => setPanelAbierto(false), 800);
      } else {
        const err = await res.json();
        toast.error(err.error || "Error al enviar");
      }
    } catch { toast.error("Error de conexión"); }
    finally { setEnviando(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="text-primary-600" size={20} />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Reportar incidencia</h2>
        </div>
        <button type="button" onClick={() => setPanelAbierto(false)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <X size={18} className="text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {Object.entries(TIPOS_INCIDENCIA_CONFIG).map(([key, config]) => (
          <button key={key} type="button" onClick={() => setTipo(key)}
            className={`p-3 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 border-2 ${
              tipo === key ? `border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 scale-[1.02] shadow-sm` : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300"
            }`}>
            <span className="text-base">{config.emoji}</span> {config.label}
          </button>
        ))}
      </div>

      <Textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Describe la situación (sin nombres de personas)..."
        maxLength={300} rows={3} required className="text-sm" />

      <label className="flex items-center gap-2.5 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
        <input type="checkbox" checked={usarRango} onChange={(e) => setUsarRango(e.target.checked)}
          className="w-4 h-4 rounded accent-primary-600" />
        <Clock size={15} /> Definir rango horario (máx. 12h)
      </label>

      {usarRango && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Desde</label>
            <Input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} required={usarRango} />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Hasta</label>
            <Input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} required={usarRango} />
          </div>
        </div>
      )}

      <button type="button" onClick={handleUbicacion}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 border-2 ${
          granted ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400" : "bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-100"
        }`}>
        <Navigation size={15} />
        {geoLoading ? "Obteniendo..." : granted ? "Ubicación obtenida" : "Usar mi ubicación"}
      </button>
      {geoError && <p className="text-xs text-red-500 text-center">{geoError}</p>}
      <p className="text-[11px] text-gray-400 text-center">Lat: {reportLat.toFixed(4)}, Lng: {reportLng.toFixed(4)}</p>

      <Button type="submit" disabled={enviando || !tipo} variant="danger" size="lg" className="w-full shadow-lg shadow-red-600/20">
        {enviando ? "Enviando..." : "Reportar incidencia"}
      </Button>
    </form>
  );
}
