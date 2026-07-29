"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, AlertTriangle, MessageSquare, Shield, Bus } from "lucide-react";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-950 dark:to-gray-900 px-6 py-12 flex flex-col items-center justify-center">
      <div className="max-w-sm w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-600/20">
          <Bus size={36} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">ReportaTuMicro</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">Transporte público de Santiago, informado por la comunidad</p>

        <div className="space-y-4 text-left mb-10">
          <div className="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg flex-shrink-0">
              <MapPin className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">Explora el mapa</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Encuentra paraderos cercanos y sus reseñas</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg flex-shrink-0">
              <AlertTriangle className="text-amber-600 dark:text-amber-400" size={20} />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">Reporta incidencias</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Atrasos, fiscalizadores o zonas inseguras en tiempo real</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg flex-shrink-0">
              <MessageSquare className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">Deja reseñas</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Califica paraderos y ayuda a otros pasajeros</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg flex-shrink-0">
              <Shield className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">Privacidad primero</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Sin historial de ubicación. Solo datos anónimos y puntuales</p>
            </div>
          </div>
        </div>

        <Link href="/">
          <Button size="lg" className="w-full shadow-xl shadow-primary-600/20 text-base">
            Ir al mapa
          </Button>
        </Link>
      </div>
    </main>
  );
}
