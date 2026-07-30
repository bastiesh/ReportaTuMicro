"use client";

import { useMapaStore } from "@/stores/mapaStore";
import { FiltrosMapa } from "@/components/mapa/FiltrosMapa";
import { LeyendaMapa } from "@/components/mapa/LeyendaMapa";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import dynamic from "next/dynamic";

const MapaCliente = dynamic(() => import("@/components/mapa/MapaCliente"), { ssr: false });
const FormularioIncidencia = dynamic(() => import("@/components/reportes/FormularioIncidencia"), { ssr: false });

export default function HomePage() {
  const { panelAbierto, setPanelAbierto } = useMapaStore();

  return (
    <>
      <MapaCliente />
      <div className="absolute top-11 left-0 right-0 bottom-0 pointer-events-none z-10">
        <FiltrosMapa />
        <LeyendaMapa />
      </div>

      {!panelAbierto && (
        <Button onClick={() => setPanelAbierto(true)} size="icon"
          className="fixed bottom-6 right-4 z-[1000] rounded-full shadow-2xl w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 border-2 border-white/20">
          <Plus size={28} strokeWidth={2.5} />
        </Button>
      )}

      {panelAbierto && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[1500] backdrop-blur-sm" onClick={() => setPanelAbierto(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[2000] bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mt-3 mb-1" />
            <div className="p-5 pb-8">
              <FormularioIncidencia />
            </div>
          </div>
        </>
      )}
    </>
  );
}
