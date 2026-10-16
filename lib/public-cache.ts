"use client"

export async function invalidatePublicCache(
  resource: "projects" | "logs" | "brain" | "overview",
  id?: string,
) {
  try {
    const response = await fetch("/api/cache/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource, id }),
    })

    if (!response.ok) console.warn("Public cache invalidation failed", resource)
  } catch {
    console.warn("Public cache invalidation request failed", resource)
  }
}
