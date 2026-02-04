import { NextResponse } from "next/server"
import { getPSEBanks } from "@/lib/payu"

export async function GET() {
  try {
    const result = await getPSEBanks()

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "No se pudo obtener la lista de bancos" },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, banks: result.banks })
  } catch (error) {
    console.error("Error al obtener bancos PSE:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}
