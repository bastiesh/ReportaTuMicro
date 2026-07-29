import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { addMinutes, differenceInHours, isAfter } from "date-fns";

const incidenciaSchema = z.object({
  tipo: z.enum(["ATRASO", "FISCALIZADOR", "ZONA_INSEGURA", "OTRO"]),
  descripcion: z.string().min(5, "Mínimo 5 caracteres").max(300, "Máximo 300 caracteres"),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  horaInicio: z.string().datetime().optional(),
  horaFin: z.string().datetime().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tipo, descripcion, lat, lng, horaInicio, horaFin } = incidenciaSchema.parse(body);

    const ahora = new Date();
    let expiraAt: Date;

    if (horaInicio && horaFin) {
      const inicio = new Date(horaInicio);
      const fin = new Date(horaFin);
      const duracionHoras = differenceInHours(fin, inicio);

      if (duracionHoras > 12 || duracionHoras < 0) {
        return NextResponse.json({ error: "El rango horario no puede exceder 12 horas" }, { status: 400 });
      }
      if (isAfter(ahora, fin)) {
        return NextResponse.json({ error: "El rango horario ya expiró" }, { status: 400 });
      }
      expiraAt = fin;
    } else {
      expiraAt = addMinutes(ahora, 90);
    }

    const incidencia = await prisma.incidencia.create({
      data: {
        tipo, descripcion, lat, lng,
        horaInicio: horaInicio ? new Date(horaInicio) : null,
        horaFin: horaFin ? new Date(horaFin) : null,
        expiraAt,
      },
      select: { id: true, tipo: true, descripcion: true, lat: true, lng: true, horaInicio: true, horaFin: true, expiraAt: true, creadoEn: true },
    });

    return NextResponse.json(incidencia, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || "Datos inválidos" }, { status: 400 });
    }
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

    const ahora = new Date();
    const incidencias = await prisma.incidencia.findMany({
      where: {
        expiraAt: { gt: ahora },
        lat: { gte: south, lte: north },
        lng: { gte: west, lte: east },
      },
      orderBy: { creadoEn: "desc" },
      take: 200,
      select: { id: true, tipo: true, descripcion: true, lat: true, lng: true, horaInicio: true, horaFin: true, expiraAt: true, creadoEn: true },
    });

    return NextResponse.json(incidencias);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
