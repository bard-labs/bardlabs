export type GithubContributionDay = { date: string; count: number }

const USER = "BardiaMardan"

/** Public year graph for github.com/BardiaMardan (no auth). */
export async function fetchGithubContributions(
  username = USER,
): Promise<GithubContributionDay[]> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error(`GitHub contributions failed (${res.status})`)
  }

  const json = (await res.json()) as {
    contributions?: { date: string; count: number }[]
  }

  return (json.contributions ?? []).map((d) => ({
    date: d.date,
    count: d.count,
  }))
}
