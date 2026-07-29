"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/star-rating";
import { contieneNombrePropio } from "@/lib/validaciones";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

export function FormularioResena({ paraderoId, onSuccess }: { paraderoId: string; onSuccess?: () => void }) {
  const [texto, setTexto] = useState("");
  const [rating, setRating] = useState(0);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { toast.error("Selecciona una calificación"); return; }
    if (contieneNombrePropio(texto)) { toast.error("No incluyas nombres de personas"); return; }

    setEnviando(true);
    try {
      const res = await fetch(`/api/paraderos/${paraderoId}/resenas`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto, rating }),
      });
      if (res.ok) {
        toast.success("¡Reseña publicada!");
        setTexto(""); setRating(0);
        onSuccess?.();
      } else {
        const err = await res.json();
        toast.error(err.error || "Error al publicar");
      }
    } catch { toast.error("Error de conexión"); }
    finally { setEnviando(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 space-y-3">
      <div className="flex items-center gap-2">
        <MessageSquare className="text-primary-600" size={18} />
        <h3 className="font-bold text-sm text-gray-900 dark:text-white">Dejar reseña</h3>
      </div>
      <StarRating value={rating} onChange={setRating} size={26} />
      <Textarea value={texto} onChange={(e) => setTexto(e.target.value)}
        placeholder="¿Cómo es este paradero?" maxLength={500} rows={2} required />
      <Button type="submit" disabled={enviando || rating === 0} size="sm" className="w-full">
        {enviando ? "Publicando..." : "Publicar reseña"}
      </Button>
    </form>
  );
}
