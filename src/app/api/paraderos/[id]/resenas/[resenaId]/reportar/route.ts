import { NextResponse } from "next/server";

export async function POST(_: Request, { params }: { params: Promise<{ id: string; resenaId: string }> }) {
  try {
    const { resenaId } = await params;
    // For demo, just return success without actually updating
    return NextResponse.json({ reportes: 1, oculta: false });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Error al reportar" }, { status: 500 });
  }
}
