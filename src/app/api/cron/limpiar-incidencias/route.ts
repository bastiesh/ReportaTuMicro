import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const ahora = new Date();
  const resultado = await prisma.incidencia.deleteMany({
    where: { expiraAt: { lt: ahora } },
  });

  return NextResponse.json({
    limpiadas: resultado.count,
    timestamp: ahora.toISOString(),
  });
}
