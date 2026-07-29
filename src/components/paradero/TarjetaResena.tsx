"use client";
import { Resena } from "@/types";
import { StarRating } from "@/components/ui/star-rating";
import { Flag, Clock } from "lucide-react";
import { formatTimeAgo } from "@/lib/validaciones";
import { useState } from "react";
import { toast } from "sonner";

export function TarjetaResena({ resena, onReportar }: { resena: Resena; onReportar?: (id: string) => void }) {
  const [reportado, setReportado] = useState(false);

  const reportar = async () => {
    if (reportado) return;
    await fetch(`/api/paraderos/${resena.paraderoId}/resenas/${resena.id}/reportar`, { method: "POST" });
    setReportado(true);
    onReportar?.(resena.id);
    toast.success("Reseña reportada. Gracias por ayudar a moderar.");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-2">
        <StarRating value={resena.rating} onChange={() => {}} readonly size={16} />
        <span className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <Clock size={11} /> {formatTimeAgo(new Date(resena.creadoEn))}
        </span>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">{resena.texto}</p>
      <button onClick={reportar} disabled={reportado}
        className="text-[11px] text-gray-400 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-1.5 transition-colors disabled:text-red-500 dark:disabled:text-red-400 disabled:cursor-default">
        <Flag size={11} /> {reportado ? "Reportado" : "Reportar abuso"}
      </button>
    </div>
  );
}
