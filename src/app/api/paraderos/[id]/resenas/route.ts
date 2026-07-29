import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { contieneNombrePropio } from "@/lib/validaciones";

const resenaSchema = z.object({
  texto: z.string().min(5, "Mínimo 5 caracteres").max(500, "Máximo 500 caracteres"),
  rating: z.number().int().min(1).max(5),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paraderoId } = await params;
    const body = await request.json();
    const { texto, rating } = resenaSchema.parse(body);

    if (contieneNombrePropio(texto)) {
      return NextResponse.json({ error: "El texto no debe contener nombres de personas" }, { status: 400 });
    }

    const resena = await prisma.resena.create({
      data: { paraderoId, texto, rating },
      select: { id: true, texto: true, rating: true, reportesAbuso: true, oculta: true, creadoEn: true },
    });

    return NextResponse.json(resena, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || "Datos inválidos" }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al crear reseña" }, { status: 500 });
  }
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paraderoId } = await params;
    const resenas = await prisma.resena.findMany({
      where: { paraderoId, oculta: false },
      orderBy: { creadoEn: "desc" },
      take: 50,
      select: { id: true, paraderoId: true, texto: true, rating: true, reportesAbuso: true, oculta: true, creadoEn: true },
    });
    return NextResponse.json(resenas);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
