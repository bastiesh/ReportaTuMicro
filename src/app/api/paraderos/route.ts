import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_AREA = 0.5; // ~50km²
const MAX_RESULTS = 500;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const north = parseFloat(searchParams.get("north") || "0");
    const south = parseFloat(searchParams.get("south") || "0");
    const east = parseFloat(searchParams.get("east") || "0");
    const west = parseFloat(searchParams.get("west") || "0");

    if ([north, south, east, west].some((v) => isNaN(v))) {
      return NextResponse.json({ error: "Bounds inválidos" }, { status: 400 });
    }

    const area = Math.abs(north - south) * Math.abs(east - west);
    if (area > MAX_AREA) {
      return NextResponse.json({ error: "Área de búsqueda muy grande. Acerca el zoom." }, { status: 400 });
    }

    const paraderos = await prisma.paradero.findMany({
      where: {
        lat: { gte: south, lte: north },
        lng: { gte: west, lte: east },
      },
      take: MAX_RESULTS,
      select: { id: true, gtfsStopId: true, nombre: true, lat: true, lng: true, comuna: true },
    });

    return NextResponse.json(paraderos);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
