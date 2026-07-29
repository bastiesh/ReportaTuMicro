"use client";
import { create } from "zustand";

interface Bounds { north: number; south: number; east: number; west: number; }

interface MapaState {
  bounds: Bounds | null;
  zoom: number;
  centro: { lat: number; lng: number };
  filtros: { tiposIncidencia: string[]; mostrarParaderos: boolean; mostrarIncidencias: boolean; };
  paraderoSeleccionado: string | null;
  panelAbierto: boolean;
  modoOscuro: boolean;
  setBounds: (bounds: Bounds) => void;
  setZoom: (zoom: number) => void;
  setCentro: (centro: { lat: number; lng: number }) => void;
  setFiltros: (filtros: Partial<MapaState["filtros"]>) => void;
  seleccionarParadero: (id: string | null) => void;
  setPanelAbierto: (abierto: boolean) => void;
  toggleModoOscuro: () => void;
}

export const useMapaStore = create<MapaState>((set) => ({
  bounds: null, zoom: 13, centro: { lat: -33.4489, lng: -70.6693 },
  filtros: { tiposIncidencia: [], mostrarParaderos: true, mostrarIncidencias: true },
  paraderoSeleccionado: null, panelAbierto: false, modoOscuro: false,
  setBounds: (bounds) => set({ bounds }),
  setZoom: (zoom) => set({ zoom }),
  setCentro: (centro) => set({ centro }),
  setFiltros: (filtros) => set((state) => ({ filtros: { ...state.filtros, ...filtros } })),
  seleccionarParadero: (id) => set({ paraderoSeleccionado: id }),
  setPanelAbierto: (abierto) => set({ panelAbierto: abierto }),
  toggleModoOscuro: () => set((state) => ({ modoOscuro: !state.modoOscuro })),
}));
