import { NextResponse } from "next/server"
import { testPayUConnection } from "@/lib/payu-sdk"

export async function GET() {
  try {
    const result = await testPayUConnection()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error testing PayU connection:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
