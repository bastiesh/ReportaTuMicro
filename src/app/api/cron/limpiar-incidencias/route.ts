import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // For demo on Vercel, just return success without actually deleting
  const ahora = new Date();
  return NextResponse.json({
    limpiadas: 0,
    timestamp: ahora.toISOString(),
  });
}
