import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_RESULTS = 500;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const north = parseFloat(searchParams.get("north") || "0");
    const south = parseFloat(searchParams.get("south") || "0");
    const east = parseFloat(searchParams.get("east") || "0");
    const west = parseFloat(searchParams.get("west") || "0");

    // If bounds are provided, filter by them for performance
    const whereClause = [north, south, east, west].every(v => !isNaN(v) && v !== 0)
      ? {
          lat: { gte: south, lte: north },
          lng: { gte: west, lte: east },
        }
      : {};

    const paraderos = await prisma.paradero.findMany({
      where: whereClause,
      take: MAX_RESULTS,
      select: { id: true, gtfsStopId: true, nombre: true, lat: true, lng: true, comuna: true },
    });

    // Add mock stopTimes for demo purposes
    const mockRoutes = [
      { id: "r1", shortName: "D05", longName: "Metro Los Héroes - La Reina", color: "#0066CC", textColor: "#FFFFFF", tipo: "urbano" },
      { id: "r2", shortName: "D07", longName: "Metro Santa Ana - Peñalolén", color: "#009900", textColor: "#FFFFFF", tipo: "urbano" },
      { id: "r3", shortName: "D12", longName: "Metro La Cisterna - Las Condes", color: "#FF6600", textColor: "#FFFFFF", tipo: "troncal" },
      { id: "r4", shortName: "506", longName: "Maipú - Providencia", color: "#CC0066", textColor: "#FFFFFF", tipo: "alimentador" },
      { id: "r5", shortName: "510", longName: "Cerro Navia - Santiago Centro", color: "#660099", textColor: "#FFFFFF", tipo: "alimentador" },
    ];

    const paraderosConRutas = paraderos.map((p, idx) => ({
      ...p,
      stopTimes: [
        { stopSequence: 1, arrivalTime: "08:30:00", trip: { headsign: mockRoutes[idx % mockRoutes.length].longName, route: mockRoutes[idx % mockRoutes.length] } },
        { stopSequence: 2, arrivalTime: "08:45:00", trip: { headsign: mockRoutes[(idx + 1) % mockRoutes.length].longName, route: mockRoutes[(idx + 1) % mockRoutes.length] } },
      ].slice(0, 2),
    }));

    return NextResponse.json(paraderosConRutas);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
