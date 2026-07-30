import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Mock resenas for Vercel deployment
const mockResenas: Record<string, any[]> = {
  "p1": [
    { id: "r1", paraderoId: "p1", texto: "Buen servicio", rating: 5, reportesAbuso: 0, oculta: false, creadoEn: new Date() },
    { id: "r2", paraderoId: "p1", texto: "Llegó a tiempo", rating: 4, reportesAbuso: 0, oculta: false, creadoEn: new Date() },
  ],
  "p2": [
    { id: "r3", paraderoId: "p2", texto: "Micro llena", rating: 3, reportesAbuso: 0, oculta: false, creadoEn: new Date() },
  ],
};

const resenaSchema = z.object({
  texto: z.string().min(5, "Mínimo 5 caracteres").max(500, "Máximo 500 caracteres"),
  rating: z.number().int().min(1).max(5),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paraderoId } = await params;
    const body = await request.json();
    const { texto, rating } = resenaSchema.parse(body);

    // For demo, just return success without actually saving
    const resena = {
      id: `r${Date.now()}`,
      paraderoId,
      texto,
      rating,
      reportesAbuso: 0,
      oculta: false,
      creadoEn: new Date(),
    };

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
    const resenas = mockResenas[paraderoId] || [];
    return NextResponse.json(resenas);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
