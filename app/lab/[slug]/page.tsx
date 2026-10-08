import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getDiscipline, labDisciplines } from "@/lib/lab"

export function generateStaticParams() {
  return labDisciplines.map((d) => ({ slug: d.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const discipline = getDiscipline(slug)
  if (!discipline) return { title: "Lab · Bardlabs" }
  return {
    title: `${discipline.title} · Bardlabs`,
    description: discipline.summary,
  }
}

export default async function LabDisciplinePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const discipline = getDiscipline(slug)
  if (!discipline) notFound()

  const Icon = discipline.icon

  return (
    <main className="min-h-[100svh] bg-[#050505] px-4 pb-28 pt-28 text-white sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-neutral-500 transition-colors hover:text-white"
        >
          <ArrowLeft size={14} />
          Lab
        </Link>

        <div className="mt-10 flex items-start gap-5 border-b border-white/10 pb-8">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.03]">
            <Icon size={22} strokeWidth={1.4} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
              {discipline.subtitle}
            </p>
            <h1 className="mt-2 text-4xl font-medium tracking-tight sm:text-5xl">
              {discipline.title}
            </h1>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg">
          {discipline.summary}
        </p>

        <div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2">
          <div className="bg-[#050505] p-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">Status</p>
            <p className="mt-2 text-sm text-neutral-300">
              Milestone 1 — page shell live. Experiments and notes land here next.
            </p>
          </div>
          <div className="bg-[#050505] p-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">Related</p>
            <div className="mt-2 flex flex-wrap gap-3 text-sm">
              <Link href="/projects" className="text-white underline-offset-4 hover:underline">
                Archive
              </Link>
              <Link href="/brain" className="text-white underline-offset-4 hover:underline">
                Brain
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
