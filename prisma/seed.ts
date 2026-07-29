import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const paraderosSeed = [
  { gtfsStopId: "PA001", nombre: "Av. Libertador / Bustamante", lat: -33.4372, lng: -70.6506, comuna: "Providencia" },
  { gtfsStopId: "PA002", nombre: "Av. Providencia / Los Leones", lat: -33.4250, lng: -70.6115, comuna: "Providencia" },
  { gtfsStopId: "PA003", nombre: "Av. Apoquindo / El Bosque", lat: -33.4160, lng: -70.5860, comuna: "Las Condes" },
  { gtfsStopId: "PA004", nombre: "Av. Las Condes / Padre Hurtado", lat: -33.4100, lng: -70.5700, comuna: "Las Condes" },
  { gtfsStopId: "PA005", nombre: "Av. Vitacura / Tabancura", lat: -33.3900, lng: -70.5800, comuna: "Vitacura" },
  { gtfsStopId: "PA006", nombre: "Av. Kennedy / Gerónimo de Alderete", lat: -33.4020, lng: -70.5750, comuna: "Las Condes" },
  { gtfsStopId: "PA007", nombre: "Av. Irarrázaval / Grecia", lat: -33.4550, lng: -70.6050, comuna: "Ñuñoa" },
  { gtfsStopId: "PA008", nombre: "Av. Macul / La Florida", lat: -33.4900, lng: -70.5900, comuna: "Macul" },
  { gtfsStopId: "PA009", nombre: "Av. Vicuña Mackenna / Plaza Italia", lat: -33.4400, lng: -70.6350, comuna: "Santiago" },
  { gtfsStopId: "PA010", nombre: "Alameda / Estación Central", lat: -33.4530, lng: -70.6780, comuna: "Estación Central" },
  { gtfsStopId: "PA011", nombre: "Av. Matta / U. de Santiago", lat: -33.4600, lng: -70.6600, comuna: "Santiago" },
  { gtfsStopId: "PA012", nombre: "Av. Recoleta / Patronato", lat: -33.4300, lng: -70.6400, comuna: "Recoleta" },
  { gtfsStopId: "PA013", nombre: "Av. Independencia / Dorsal", lat: -33.4200, lng: -70.6500, comuna: "Independencia" },
  { gtfsStopId: "PA014", nombre: "Av. La Florida / Vicuña Mackenna", lat: -33.5200, lng: -70.6000, comuna: "La Florida" },
  { gtfsStopId: "PA015", nombre: "Av. San Pablo / Teniente Cruz", lat: -33.4800, lng: -70.7200, comuna: "Maipú" },
  { gtfsStopId: "PA016", nombre: "Av. Pajaritos / Del Sol", lat: -33.4700, lng: -70.7100, comuna: "Maipú" },
  { gtfsStopId: "PA017", nombre: "Av. Grecia / Plaza Ñuñoa", lat: -33.4580, lng: -70.6000, comuna: "Ñuñoa" },
  { gtfsStopId: "PA018", nombre: "Av. Tobalaba / El Bosque", lat: -33.4450, lng: -70.5800, comuna: "La Reina" },
  { gtfsStopId: "PA019", nombre: "Av. Américo Vespucio / Príncipe de Gales", lat: -33.4000, lng: -70.5600, comuna: "La Reina" },
  { gtfsStopId: "PA020", nombre: "Av. Manquehue / Apoquindo", lat: -33.4080, lng: -70.5650, comuna: "Las Condes" },
  { gtfsStopId: "PA021", nombre: "Av. Colón / Bernardo O'Higgins", lat: -33.4480, lng: -70.6680, comuna: "Santiago" },
  { gtfsStopId: "PA022", nombre: "Av. Santa Rosa / Ramón Carnicer", lat: -33.4650, lng: -70.6250, comuna: "San Joaquín" },
  { gtfsStopId: "PA023", nombre: "Av. Gran Avenida / Lo Espejo", lat: -33.5100, lng: -70.6900, comuna: "Lo Espejo" },
  { gtfsStopId: "PA024", nombre: "Av. José Pedro Alessandri / Macul", lat: -33.4850, lng: -70.5950, comuna: "Macul" },
  { gtfsStopId: "PA025", nombre: "Av. El Salto / Huechuraba", lat: -33.3800, lng: -70.6300, comuna: "Huechuraba" },
];

async function main() {
  console.log("🌱 Seeding database...");
  await prisma.paradero.deleteMany();
  await prisma.incidencia.deleteMany();
  await prisma.resena.deleteMany();

  for (const p of paraderosSeed) {
    await prisma.paradero.create({ data: p });
  }

  const ahora = new Date();
  const expira = new Date(ahora.getTime() + 90 * 60 * 1000);

  await prisma.incidencia.create({
    data: { tipo: "ATRASO", descripcion: "Micro C10 lleva 20 min sin pasar", lat: -33.4372, lng: -70.6506, expiraAt: expira },
  });
  await prisma.incidencia.create({
    data: { tipo: "ZONA_INSEGURA", descripcion: "Poca iluminación en el paradero", lat: -33.4800, lng: -70.7200,
      expiraAt: new Date(ahora.getTime() + 4 * 60 * 60 * 1000), horaInicio: ahora, horaFin: new Date(ahora.getTime() + 4 * 60 * 60 * 1000) },
  });
  await prisma.incidencia.create({
    data: { tipo: "FISCALIZADOR", descripcion: "Control de tarjetas Bip! activo", lat: -33.4480, lng: -70.6680, expiraAt: expira },
  });

  const paradero = await prisma.paradero.findFirst({ where: { gtfsStopId: "PA001" } });
  if (paradero) {
    await prisma.resena.create({ data: { paraderoId: paradero.id, texto: "Buena frecuencia en la mañana, pero se llena mucho", rating: 4 } });
    await prisma.resena.create({ data: { paraderoId: paradero.id, texto: "El paradero está bien mantenido", rating: 5 } });
  }

  console.log("✅ Seed completado");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
