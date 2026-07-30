import { NextRequest, NextResponse } from "next/server";

const MAX_RESULTS = 500;

// Mock paraderos for Vercel deployment (SQLite doesn't work on serverless)
const mockParaderos = [
  { id: "p1", gtfsStopId: "PA001", nombre: "Paradero 1", lat: -33.4489, lng: -70.6693, comuna: "Santiago Centro" },
  { id: "p2", gtfsStopId: "PA002", nombre: "Paradero 2", lat: -33.4500, lng: -70.6700, comuna: "Santiago Centro" },
  { id: "p3", gtfsStopId: "PA003", nombre: "Paradero 3", lat: -33.4510, lng: -70.6710, comuna: "Santiago Centro" },
  { id: "p4", gtfsStopId: "PA004", nombre: "Paradero 4", lat: -33.4520, lng: -70.6720, comuna: "Santiago Centro" },
  { id: "p5", gtfsStopId: "PA005", nombre: "Paradero 5", lat: -33.4530, lng: -70.6730, comuna: "Santiago Centro" },
];

const mockRoutes = [
  { id: "r1", shortName: "D05", longName: "Metro Los Héroes - La Reina", color: "#0066CC", textColor: "#FFFFFF", tipo: "urbano" },
  { id: "r2", shortName: "D07", longName: "Metro Santa Ana - Peñalolén", color: "#009900", textColor: "#FFFFFF", tipo: "urbano" },
  { id: "r3", shortName: "D12", longName: "Metro La Cisterna - Las Condes", color: "#FF6600", textColor: "#FFFFFF", tipo: "troncal" },
  { id: "r4", shortName: "506", longName: "Maipú - Providencia", color: "#CC0066", textColor: "#FFFFFF", tipo: "alimentador" },
  { id: "r5", shortName: "510", longName: "Cerro Navia - Santiago Centro", color: "#660099", textColor: "#FFFFFF", tipo: "alimentador" },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const north = parseFloat(searchParams.get("north") || "0");
    const south = parseFloat(searchParams.get("south") || "0");
    const east = parseFloat(searchParams.get("east") || "0");
    const west = parseFloat(searchParams.get("west") || "0");

    // Filter mock paraderos by bounds if provided
    let filteredParaderos = mockParaderos;
    if ([north, south, east, west].every(v => !isNaN(v) && v !== 0)) {
      filteredParaderos = mockParaderos.filter(p => 
        p.lat >= south && p.lat <= north && p.lng >= west && p.lng <= east
      );
    }

    const paraderosConRutas = filteredParaderos.map((p, idx) => ({
      ...p,
      stopTimes: [
        { stopSequence: 1, arrivalTime: "08:30:00", trip: { headsign: mockRoutes[idx % mockRoutes.length].longName, route: mockRoutes[idx % mockRoutes.length] } },
        { stopSequence: 2, arrivalTime: "08:45:00", trip: { headsign: mockRoutes[(idx + 1) % mockRoutes.length].longName, route: mockRoutes[(idx + 1) % mockRoutes.length] } },
      ].slice(0, 2),
    }));

    return NextResponse.json(paraderosConRutas);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
