import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Bus, Star } from "lucide-react";
import { TarjetaResena } from "@/components/paradero/TarjetaResena";
import { FormularioResena } from "@/components/paradero/FormularioResena";
import { Button } from "@/components/ui/button";

export default async function ParaderoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paradero = await prisma.paradero.findUnique({
    where: { id },
    include: { resenas: { where: { oculta: false }, orderBy: { creadoEn: "desc" } } },
  });

  if (!paradero) notFound();

  const promedio = paradero.resenas.length > 0
    ? (paradero.resenas.reduce((s, r) => s + r.rating, 0) / paradero.resenas.length).toFixed(1)
    : null;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="max-w-lg mx-auto p-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors">
          <ArrowLeft size={16} /> Volver al mapa
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 mb-5">
          <div className="flex items-start gap-4 mb-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl flex-shrink-0">
              <Bus className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{paradero.nombre}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                <MapPin size={13} /> {paradero.comuna}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {promedio ? (
              <>
                <Star className="text-amber-400 fill-amber-400" size={16} />
                <span className="font-bold text-gray-900 dark:text-white">{promedio}</span>
              </>
            ) : (
              <span className="text-sm text-gray-400">Sin calificaciones</span>
            )}
            <span className="text-sm text-gray-400 dark:text-gray-500">· {paradero.resenas.length} reseña{paradero.resenas.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="mb-5">
          <FormularioResena paraderoId={paradero.id} />
        </div>

        <div className="space-y-3">
          <h2 className="font-bold text-sm text-gray-700 dark:text-gray-300">Reseñas recientes</h2>
          {paradero.resenas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-400 dark:text-gray-500">Aún no hay reseñas</p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">¡Sé el primero en opinar!</p>
            </div>
          ) : (
            paradero.resenas.map((r) => <TarjetaResena key={r.id} resena={r} />)
          )}
        </div>
      </div>
    </main>
  );
}
