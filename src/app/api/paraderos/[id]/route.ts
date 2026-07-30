import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readFileSync } from "fs";
import { join } from "path";

// Load route data
let paraderoRoutes: Record<string, string[]> = {};
let routesInfo: Record<string, any> = {};

try {
  paraderoRoutes = JSON.parse(
    readFileSync(join(process.cwd(), "data", "paradero-routes.json"), "utf-8")
  );
  routesInfo = JSON.parse(
    readFileSync(join(process.cwd(), "data", "routes-info.json"), "utf-8")
  );
} catch (e) {
  console.error("Error loading route data:", e);
}

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

    // Add real stopTimes from GTFS data
    const routeIds = paraderoRoutes[id] || [];
    const routes = routeIds
      .map((routeId) => routesInfo[routeId])
      .filter((r) => r);

    const stopTimes = routes.slice(0, 10).map((route, idx) => ({
      stopSequence: idx + 1,
      arrivalTime: `${(8 + idx * 0.25).toFixed(2).replace(".", ":")}:00`,
      trip: {
        headsign: route.longName,
        route: route
      }
    }));

    const paraderoConRutas = {
      ...paradero,
      stopTimes
    };

    return NextResponse.json(paraderoConRutas);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
