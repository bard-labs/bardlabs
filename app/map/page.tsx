import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { FeatureOff } from "@/components/FeatureOff"
import { LabGraph } from "@/components/Lab/LabGraph"
import { isFeatureEnabled } from "@/lib/features-data"
import { fetchSiteLinks } from "@/lib/lab-data"
import { getPublicLabGraph } from "@/lib/public-data"

export const metadata = {
  title: "Connection graph · Bardlabs",
  description: "How disciplines and projects connect across the lab.",
}

export default async function MapPage() {
  if (!(await isFeatureEnabled("map"))) {
    return <FeatureOff title="Offline" featureLabel="Connections" />
  }

  const [graph, links] = await Promise.all([getPublicLabGraph(), fetchSiteLinks()])

  return (
    <main className="min-h-[100svh] bg-[#050505] px-4 pb-28 pt-28 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-neutral-500 hover:text-white"
        >
          <ArrowLeft size={14} />
          Lab
        </Link>

        <header className="mt-10 border-b border-white/10 pb-8">
          <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">Graph</p>
          <h1 className="mt-2 text-4xl font-medium tracking-tight sm:text-5xl">
            Connecting dots
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base">
            Hover a project to preview it. Click a node to open the lab field or the archive entry.
          </p>
        </header>

        <div className="mt-8 flex flex-wrap gap-2">
          {links
            .filter((l) => l.kind === "social")
            .map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.16em] text-neutral-300 hover:border-white/40 hover:text-white"
              >
                {link.label}
              </a>
            ))}
        </div>

        <section className="mt-10">
          {graph.projects.length === 0 && graph.disciplines.length === 0 ? (
            <p className="border border-white/10 p-6 text-sm text-neutral-500">No data found</p>
          ) : (
            <LabGraph
              disciplines={graph.disciplines}
              projects={graph.projects}
              links={graph.links}
            />
          )}
        </section>
      </div>
    </main>
  )
}
