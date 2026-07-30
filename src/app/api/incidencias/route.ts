import { NextRequest, NextResponse } from "next/server";

// Mock incidencias for Vercel deployment (SQLite doesn't work on serverless)
const mockIncidencias = [
  { id: "i1", tipo: "ATRASO", descripcion: "Micro con 15 minutos de retraso", lat: -33.4489, lng: -70.6693, horaInicio: null, horaFin: null, expiraAt: new Date(Date.now() + 3600000), creadoEn: new Date() },
  { id: "i2", tipo: "FISCALIZADOR", descripcion: "No hay fiscalizador en el paradero", lat: -33.4500, lng: -70.6700, horaInicio: null, horaFin: null, expiraAt: new Date(Date.now() + 7200000), creadoEn: new Date() },
  { id: "i3", tipo: "ZONA_INSEGURA", descripcion: "Zona poco iluminada por la noche", lat: -33.4510, lng: -70.6710, horaInicio: null, horaFin: null, expiraAt: new Date(Date.now() + 5400000), creadoEn: new Date() },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // For demo, just return success without actually saving
    const incidencia = {
      id: `i${Date.now()}`,
      ...body,
      expiraAt: new Date(Date.now() + 5400000),
      creadoEn: new Date(),
    };
    return NextResponse.json(incidencia, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear incidencia" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const north = parseFloat(searchParams.get("north") || "0");
    const south = parseFloat(searchParams.get("south") || "0");
    const east = parseFloat(searchParams.get("east") || "0");
    const west = parseFloat(searchParams.get("west") || "0");

    if ([north, south, east, west].some(isNaN)) {
      return NextResponse.json({ error: "Bounds inválidos" }, { status: 400 });
    }

    // Filter mock incidencias by bounds if provided
    let filteredIncidencias = mockIncidencias;
    if ([north, south, east, west].every(v => !isNaN(v) && v !== 0)) {
      filteredIncidencias = mockIncidencias.filter(i => 
        i.lat >= south && i.lat <= north && i.lng >= west && i.lng <= east
      );
    }

    return NextResponse.json(filteredIncidencias);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
