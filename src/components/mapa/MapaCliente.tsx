"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMapaStore } from "@/stores/mapaStore";
import { MarcadorParadero } from "./MarcadorParadero";
import { MarcadorIncidencia } from "./MarcadorIncidencia";
import { Paradero, Incidencia } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function MapaCliente() {
  const [mounted, setMounted] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { modoOscuro, setCentro } = useMapaStore();
  const mapRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const centerOnUser = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setCentro({ lat: latitude, lng: longitude });
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 15);
          }
        },
        (error) => {
          console.log("Geolocation denied or failed:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
  }, [setCentro]);

  useEffect(() => {
    // Request geolocation on mount
    centerOnUser();
  }, [centerOnUser]);

  if (!mounted || dimensions.width === 0) {
    return (
      <div className="h-screen w-screen bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  const tileUrl = modoOscuro
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const center = userLocation || [-33.4489, -70.6693];

  return (
    <div style={{ height: dimensions.height, width: dimensions.width, position: "fixed", top: 0, left: 0, zIndex: 0 }}>
      <MapContainer 
        ref={mapRef}
        center={center} 
        zoom={13}
        style={{ height: "100%", width: "100%" }} 
      >
        <TileLayer 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
          url={tileUrl}
        />
        <MapaController />
        <ParaderosLayer />
        <IncidenciasLayer />
        {userLocation && <UserLocationMarker position={userLocation} />}
      </MapContainer>
      <LocationButton onClick={centerOnUser} />
    </div>
  );
}

function UserLocationMarker({ position }: { position: [number, number] }) {
  const icon = L.divIcon({
    className: "user-location-marker",
    html: `<div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); width: 24px; height: 24px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(59,130,246,0.5); animation: pulse-marker 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; display: flex; align-items: center; justify-content: center;">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>`,
    iconSize: [24, 24], iconAnchor: [12, 12],
  });

  return <Marker position={position} icon={icon} />;
}

function LocationButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-6 left-4 z-[1000] bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      style={{ width: "48px", height: "48px" }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    </button>
  );
}

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
  const { bounds, filtros, zoom } = useMapaStore();
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

  // Limit markers based on zoom level for performance
  const maxMarkers = zoom < 12 ? 100 : zoom < 13 ? 300 : 500;
  const visibleParaderos = paraderos.slice(0, maxMarkers);

  if (!filtros.mostrarParaderos) return null;
  return (
    <>
      {visibleParaderos.map((p) => <MarcadorParadero key={p.id} paradero={p} />)}
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
