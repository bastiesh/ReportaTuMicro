const nombresComunes = [
  "juan","pedro","diego","maria","jose","carlos","andres","fernando","luis","miguel",
  "ana","laura","camila","valentina","daniela","francisca","antonia","martina","sofia","emilia",
  "pablo","sebastian","felipe","rodrigo","nicolas","matias","joaquin","benjamin","vicente","tomas",
  "ignacio","maximiliano","cristobal","alonsa","renata","isidora","julieta","paulina","fernanda","consuelo"
];

export function contieneNombrePropio(texto: string): boolean {
  const palabras = texto.toLowerCase().split(/\s+/);
  for (const palabra of palabras) {
    const limpia = palabra.replace(/[^a-záéíóúñ]/g, "");
    if (limpia.length < 3) continue;
    if (nombresComunes.includes(limpia)) return true;
  }
  return false;
}

export function validarRangoHorario(horaInicio: string, horaFin: string): { valido: boolean; error?: string } {
  const [h1, m1] = horaInicio.split(":").map(Number);
  const [h2, m2] = horaFin.split(":").map(Number);
  const minutosInicio = h1 * 60 + m1;
  const minutosFin = h2 * 60 + m2;
  const diff = minutosFin - minutosInicio;
  if (diff <= 0) return { valido: false, error: "La hora fin debe ser posterior a la hora inicio" };
  if (diff > 12 * 60) return { valido: false, error: "El rango no puede exceder 12 horas" };
  return { valido: true };
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return "Ahora mismo";
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHrs < 24) return `Hace ${diffHrs}h`;
  return `Hace ${diffDays}d`;
}
