import { NextResponse } from "next/server"

const MAX_NAME_LENGTH = 120
const MAX_EMAIL_LENGTH = 254
const MAX_MESSAGE_LENGTH = 4000
const MAX_TOKEN_LENGTH = 4096
const PROVIDER_TIMEOUT_MS = 8_000

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function withTimeout(signal?: AbortSignal) {
  return AbortSignal.any([signal ?? new AbortController().signal, AbortSignal.timeout(PROVIDER_TIMEOUT_MS)])
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return badRequest("Invalid JSON")
  }

  if (!isRecord(body)) return badRequest("Invalid request body")

  const name = body.name
  const email = body.email
  const message = body.message
  const token = body.token

  if (
    (name !== undefined && typeof name !== "string") ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    typeof token !== "string"
  ) {
    return badRequest("Invalid request fields")
  }

  const normalizedName = name?.trim() ?? ""
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedMessage = message.trim()
  const normalizedToken = token.trim()

  if (!normalizedEmail || !normalizedMessage || !normalizedToken) {
    return badRequest("Missing required fields")
  }

  if (
    normalizedName.length > MAX_NAME_LENGTH ||
    normalizedEmail.length > MAX_EMAIL_LENGTH ||
    normalizedMessage.length > MAX_MESSAGE_LENGTH ||
    normalizedToken.length > MAX_TOKEN_LENGTH
  ) {
    return badRequest("Request fields are too long")
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return badRequest("Invalid email")
  }

  if (!process.env.TURNSTILE_SECRET_KEY) {
    return NextResponse.json({ error: "Captcha is not configured" }, { status: 503 })
  }

  try {
    const turnstileResult = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: normalizedToken,
      }),
      signal: withTimeout(request.signal),
    })

    if (!turnstileResult.ok) {
      return NextResponse.json({ error: "Captcha verification failed" }, { status: 502 })
    }

    const turnstileOutcome: unknown = await turnstileResult.json()
    if (!isRecord(turnstileOutcome) || turnstileOutcome.success !== true) {
      return badRequest("Invalid captcha")
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (botToken && chatId) {
      const text = `📩 New Message from Bardlabs\n\n👤 Name: ${normalizedName || "Anonymous"}\n📧 Email: ${normalizedEmail}\n\n📝 Message:\n${normalizedMessage}`
      const telegramResult = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
        signal: withTimeout(request.signal),
      })

      if (!telegramResult.ok) {
        return NextResponse.json({ error: "Message delivery failed" }, { status: 502 })
      }

      const telegramOutcome: unknown = await telegramResult.json()
      if (!isRecord(telegramOutcome) || telegramOutcome.ok !== true) {
        return NextResponse.json({ error: "Message delivery failed" }, { status: 502 })
      }
    } else {
      console.warn("Telegram credentials missing, skipping notification.")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact API Error:", error instanceof Error ? error.name : "unknown")
    return NextResponse.json({ error: "External service unavailable" }, { status: 502 })
  }
}
