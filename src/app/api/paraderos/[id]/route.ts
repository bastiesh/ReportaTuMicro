import { NextResponse } from "next/server";

// Mock paraderos for Vercel deployment
const mockParaderos: Record<string, any> = {
  "p1": { id: "p1", gtfsStopId: "PA001", nombre: "Paradero 1", lat: -33.4489, lng: -70.6693, comuna: "Santiago Centro", resenas: [] },
  "p2": { id: "p2", gtfsStopId: "PA002", nombre: "Paradero 2", lat: -33.4500, lng: -70.6700, comuna: "Santiago Centro", resenas: [] },
  "p3": { id: "p3", gtfsStopId: "PA003", nombre: "Paradero 3", lat: -33.4510, lng: -70.6710, comuna: "Santiago Centro", resenas: [] },
  "p4": { id: "p4", gtfsStopId: "PA004", nombre: "Paradero 4", lat: -33.4520, lng: -70.6720, comuna: "Santiago Centro", resenas: [] },
  "p5": { id: "p5", gtfsStopId: "PA005", nombre: "Paradero 5", lat: -33.4530, lng: -70.6730, comuna: "Santiago Centro", resenas: [] },
};

const mockRoutes = [
  { id: "r1", shortName: "D05", longName: "Metro Los Héroes - La Reina", color: "#0066CC", textColor: "#FFFFFF", tipo: "urbano" },
  { id: "r2", shortName: "D07", longName: "Metro Santa Ana - Peñalolén", color: "#009900", textColor: "#FFFFFF", tipo: "urbano" },
  { id: "r3", shortName: "D12", longName: "Metro La Cisterna - Las Condes", color: "#FF6600", textColor: "#FFFFFF", tipo: "troncal" },
  { id: "r4", shortName: "506", longName: "Maipú - Providencia", color: "#CC0066", textColor: "#FFFFFF", tipo: "alimentador" },
  { id: "r5", shortName: "510", longName: "Cerro Navia - Santiago Centro", color: "#660099", textColor: "#FFFFFF", tipo: "alimentador" },
];

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const paradero = mockParaderos[id];

    if (!paradero) {
      return NextResponse.json({ error: "Paradero no encontrado" }, { status: 404 });
    }

    // Add mock stopTimes
    const stopTimes = mockRoutes.slice(0, 5).map((route, idx) => ({
      stopSequence: idx + 1,
      arrivalTime: `${(8 + idx * 0.25).toFixed(2).replace(".", ":")}:00`,
      trip: {
        headsign: route.longName,
        route: route
      }
    }));

    const paraderoConRutas = {
      ...paradero,
      stopTimes
    };

    return NextResponse.json(paraderoConRutas);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
