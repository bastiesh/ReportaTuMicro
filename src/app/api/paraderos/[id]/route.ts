import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const paradero = await prisma.paradero.findUnique({
      where: { id },
      include: {
        resenas: {
          where: { oculta: false },
          orderBy: { creadoEn: "desc" },
          take: 50,
        },
      },
    });

    if (!paradero) {
      return NextResponse.json({ error: "Paradero no encontrado" }, { status: 404 });
    }

    return NextResponse.json(paradero);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
