"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMapaStore } from "@/stores/mapaStore";
import { MarcadorParadero } from "./MarcadorParadero";
import { MarcadorIncidencia } from "./MarcadorIncidencia";
import { Paradero, Incidencia } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

function MapaController() {
  const map = useMap();
  const { setBounds, setZoom, setCentro } = useMapaStore();

  const actualizar = useCallback(() => {
    const b = map.getBounds();
    setBounds({ north: b.getNorth(), south: b.getSouth(), east: b.getEast(), west: b.getWest() });
    setZoom(map.getZoom());
    setCentro({ lat: map.getCenter().lat, lng: map.getCenter().lng });
  }, [map, setBounds, setZoom, setCentro]);

  useMapEvents({ moveend: actualizar, zoomend: actualizar });
  useEffect(() => { actualizar(); }, [actualizar]);

  return null;
}

function ParaderosLayer() {
  const [paraderos, setParaderos] = useState<Paradero[]>([]);
  const [loading, setLoading] = useState(false);
  const { bounds, filtros } = useMapaStore();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!bounds || !filtros.mostrarParaderos) return;
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    const params = new URLSearchParams({
      north: bounds.north.toString(), south: bounds.south.toString(),
      east: bounds.east.toString(), west: bounds.west.toString(),
    });

    setLoading(true);
    const t = setTimeout(() => {
      fetch(`/api/paraderos?${params}`, { signal: abortRef.current!.signal })
        .then(r => r.json())
        .then(setParaderos)
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 250);

    return () => { clearTimeout(t); abortRef.current?.abort(); };
  }, [bounds, filtros.mostrarParaderos]);

  if (!filtros.mostrarParaderos) return null;
  return (
    <>
      {paraderos.map((p) => <MarcadorParadero key={p.id} paradero={p} />)}
      {loading && <div style={{ display: "none" }}><Skeleton /></div>}
    </>
  );
}

function IncidenciasLayer() {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const { bounds, filtros } = useMapaStore();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!bounds || !filtros.mostrarIncidencias) return;
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    const params = new URLSearchParams({
      north: bounds.north.toString(), south: bounds.south.toString(),
      east: bounds.east.toString(), west: bounds.west.toString(),
    });

    const t = setTimeout(() => {
      fetch(`/api/incidencias?${params}`, { signal: abortRef.current!.signal })
        .then(r => r.json())
        .then(setIncidencias)
        .catch(() => {});
    }, 250);

    return () => { clearTimeout(t); abortRef.current?.abort(); };
  }, [bounds, filtros.mostrarIncidencias]);

  if (!filtros.mostrarIncidencias) return null;
  return <>{incidencias.map((i) => <MarcadorIncidencia key={i.id} incidencia={i} />)}</>;
}

export default function MapaCliente() {
  const { modoOscuro } = useMapaStore();
  const tileUrl = modoOscuro
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <MapContainer center={[-33.4489, -70.6693]} zoom={13}
      style={{ height: "100vh", width: "100%" }} zoomControl={false}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url={tileUrl} />
      <MapaController />
      <ParaderosLayer />
      <IncidenciasLayer />
    </MapContainer>
  );
}
