"use client"

import { useMemo, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useReducedMotion } from "framer-motion"

type GraphProject = {
  id: string
  title: string
  image: string | null
  href: string
}

type GraphDiscipline = {
  id: string
  title: string
  subtitle: string
  href: string
}

type GraphLink = {
  project_id: string
  discipline_id: string
}

type SimNode = {
  id: string
  kind: "hub" | "discipline" | "project"
  label: string
  href: string
  image: string | null
  x: number
  y: number
  vx: number
  vy: number
}

const DISCIPLINE_COLOR: Record<string, string> = {
  systems: "#4ade80",
  intelligence: "#c4b5fd",
  mechanics: "#7dd3fc",
  inquiry: "#fde68a",
  flight: "#a5b4fc",
  surfaces: "#fda4af",
}

function layout(
  disciplines: GraphDiscipline[],
  projects: GraphProject[],
  links: GraphLink[],
) {
  const nodes: SimNode[] = [
    { id: "hub", kind: "hub", label: "Bardlabs", href: "/", image: null, x: 0, y: 0, vx: 0, vy: 0 },
  ]

  disciplines.forEach((discipline, index) => {
    const angle = (index / Math.max(disciplines.length, 1)) * Math.PI * 2 - Math.PI / 2
    nodes.push({
      id: discipline.id,
      kind: "discipline",
      label: discipline.title,
      href: discipline.href,
      image: null,
      x: Math.cos(angle) * 220,
      y: Math.sin(angle) * 220,
      vx: 0,
      vy: 0,
    })
  })

  const byProject = new Map<string, string[]>()
  links.forEach((link) => {
    const list = byProject.get(link.project_id) ?? []
    list.push(link.discipline_id)
    byProject.set(link.project_id, list)
  })

  projects.forEach((project, index) => {
    const parents = byProject.get(project.id) ?? []
    const parentNodes = nodes.filter((node) => parents.includes(node.id))
    const angle = (index / Math.max(projects.length, 1)) * Math.PI * 2
    const seedX = parentNodes.length
      ? parentNodes.reduce((sum, node) => sum + node.x, 0) / parentNodes.length
      : Math.cos(angle) * 360
    const seedY = parentNodes.length
      ? parentNodes.reduce((sum, node) => sum + node.y, 0) / parentNodes.length
      : Math.sin(angle) * 360
    const jitter = ((index % 7) - 3) * 18
    nodes.push({
      id: project.id,
      kind: "project",
      label: project.title,
      href: project.href,
      image: project.image,
      x: seedX * 1.55 + jitter,
      y: seedY * 1.55 - jitter,
      vx: 0,
      vy: 0,
    })
  })

  const edges: Array<[string, string]> = [
    ...disciplines.map((discipline) => ["hub", discipline.id] as [string, string]),
    ...links.map((link) => [link.discipline_id, link.project_id] as [string, string]),
  ]

  const indexOf = new Map(nodes.map((node, i) => [node.id, i]))
  for (let step = 0; step < 90; step += 1) {
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i]!
        const b = nodes[j]!
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const min = a.kind === "project" || b.kind === "project" ? 88 : 130
        if (dist < min) {
          const force = ((min - dist) / dist) * 0.08
          const fx = dx * force
          const fy = dy * force
          if (a.kind !== "hub") {
            a.x -= fx
            a.y -= fy
          }
          if (b.kind !== "hub") {
            b.x += fx
            b.y += fy
          }
        }
      }
    }

    edges.forEach(([from, to]) => {
      const a = nodes[indexOf.get(from)!]
      const b = nodes[indexOf.get(to)!]
      if (!a || !b) return
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const rest = a.kind === "hub" || b.kind === "hub" ? 210 : 140
      const force = (dist - rest) * 0.02
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      if (a.kind !== "hub") {
        a.x += fx
        a.y += fy
      }
      if (b.kind !== "hub") {
        b.x -= fx
        b.y -= fy
      }
    })
  }

  const xs = nodes.map((node) => node.x)
  const ys = nodes.map((node) => node.y)
  const minX = Math.min(...xs) - 140
  const maxX = Math.max(...xs) + 140
  const minY = Math.min(...ys) - 140
  const maxY = Math.max(...ys) + 160

  return {
    nodes,
    edges,
    viewBox: `${minX} ${minY} ${maxX - minX} ${maxY - minY}`,
  }
}

export function LabGraph({
  disciplines,
  projects,
  links,
}: {
  disciplines: GraphDiscipline[]
  projects: GraphProject[]
  links: GraphLink[]
}) {
  const router = useRouter()
  const reduce = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [cursor, setCursor] = useState<{ x: number; y: number; image: string; title: string } | null>(null)

  const graph = useMemo(
    () => layout(disciplines, projects, links),
    [disciplines, projects, links],
  )

  const nodeById = useMemo(
    () => new Map(graph.nodes.map((node) => [node.id, node])),
    [graph.nodes],
  )

  const [vbMinX, vbMinY, vbW, vbH] = graph.viewBox.split(" ").map(Number)

  return (
    <div
      ref={wrapRef}
      className="relative min-h-[72svh] overflow-hidden border border-white/10 bg-[#070707]"
      onPointerMove={(event) => {
        if (!cursor) return
        setCursor((current) =>
          current ? { ...current, x: event.clientX, y: event.clientY } : current,
        )
      }}
      onPointerLeave={() => setCursor(null)}
      style={{ cursor: cursor ? "none" : "default" }}
    >
      <svg viewBox={graph.viewBox} className="h-[72svh] w-full" aria-hidden>
        {graph.edges.map(([from, to]) => {
          const a = nodeById.get(from)
          const b = nodeById.get(to)
          if (!a || !b) return null
          return (
            <line
              key={`${from}-${to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgba(255,255,255,0.14)"
              strokeWidth={1.2}
            />
          )
        })}
      </svg>

      {graph.nodes.map((node) => {
        const color = DISCIPLINE_COLOR[node.id] ?? "#ffffff"
        const size = node.kind === "hub" ? 56 : node.kind === "discipline" ? 36 : 44
        const left = ((node.x - vbMinX) / vbW) * 100
        const top = ((node.y - vbMinY) / vbH) * 100
        return (
          <button
            key={node.id}
            type="button"
            onClick={() => router.push(node.href)}
            onPointerDown={() => router.push(node.href)}
            onPointerEnter={(event) => {
              if (node.kind === "project" && node.image) {
                setCursor({ x: event.clientX, y: event.clientY, image: node.image, title: node.label })
              }
            }}
            onPointerLeave={() => setCursor(null)}
            className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            {node.kind === "project" && node.image ? (
              <Image
                src={node.image}
                alt=""
                width={128}
                height={128}
                className="rounded-full border border-white/20 object-cover"
                style={{ width: size, height: size }}
              />
            ) : (
              <span
                className="rounded-full border border-white/25"
                style={{
                  width: size,
                  height: size,
                  background: node.kind === "hub" ? "#111" : color,
                }}
              />
            )}
            <span className={`mt-1 max-w-[7.5rem] text-center leading-tight text-white ${node.kind === "project" ? "text-[10px] text-neutral-300" : "text-xs"}`}>
              {node.label}
            </span>
          </button>
        )
      })}

      {cursor && !reduce ? (
        <div
          aria-hidden
          className="pointer-events-none fixed z-50 size-16 overflow-hidden rounded-full border border-white/30 bg-black shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
          style={{
            left: cursor.x - 32,
            top: cursor.y - 32,
            transform: "translateZ(0)",
          }}
        >
          <Image src={cursor.image} alt="" fill sizes="64px" className="object-cover" />
        </div>
      ) : null}
    </div>
  )
}
