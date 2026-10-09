"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      setError("Invalid credentials")
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-neutral-900 p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-white">Bard Labs.</h1>
          <p className="text-sm text-neutral-400">Admin only · no public accounts</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
          <div className="space-y-2">
            <input
              type="email"
              name="email"
              autoComplete="username"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-white placeholder:text-neutral-500 focus:border-white/20 focus:outline-none transition-colors"
              required
            />
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-white placeholder:text-neutral-500 focus:border-white/20 focus:outline-none transition-colors"
              required
            />
          </div>

          {error ? <p className="text-center text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Enter"}
            {!loading && <ChevronRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  )
}
