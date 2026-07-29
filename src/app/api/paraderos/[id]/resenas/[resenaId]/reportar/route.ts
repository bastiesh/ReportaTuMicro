import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: Promise<{ id: string; resenaId: string }> }) {
  try {
    const { resenaId } = await params;
    const resena = await prisma.resena.update({
      where: { id: resenaId },
      data: { reportesAbuso: { increment: 1 } },
    });

    if (resena.reportesAbuso >= 3) {
      await prisma.resena.update({
        where: { id: resenaId },
        data: { oculta: true },
      });
    }

    return NextResponse.json({ reportes: resena.reportesAbuso, oculta: resena.reportesAbuso >= 3 });
  } catch {
    return NextResponse.json({ error: "Error al reportar" }, { status: 500 });
  }
}
