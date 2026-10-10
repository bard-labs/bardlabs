import { NextResponse } from "next/server"
import { fetchGithubContributions } from "@/lib/github-contributions"

export async function GET() {
  try {
    const contributions = await fetchGithubContributions("BardiaMardan")
    return NextResponse.json({ contributions })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load contributions"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
