import Link from "next/link"
import { ArrowLeft, ChevronRight, FileText, Folder, Link2, Network } from "lucide-react"
import { fetchLabTree, fetchSiteLinks, type LabNode } from "@/lib/lab-data"

type TreeNode = LabNode & { children: TreeNode[] }

function buildTree(nodes: LabNode[]): TreeNode[] {
  const map = new Map<string, TreeNode>()
  nodes.forEach((n) => map.set(n.id, { ...n, children: [] }))
  const roots: TreeNode[] = []
  map.forEach((node) => {
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id)!.children.push(node)
    } else {
      roots.push(node)
    }
  })
  const sortRec = (list: TreeNode[]) => {
    list.sort((a, b) => a.sort_order - b.sort_order)
    list.forEach((c) => sortRec(c.children))
  }
  sortRec(roots)
  return roots
}

const icons = {
  folder: Folder,
  discipline: Network,
  project: FileText,
  link: Link2,
  note: FileText,
} as const

function NodeRow({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const Icon = icons[node.kind]
  const inner = (
    <div
      className="flex items-start gap-3 border-b border-white/10 py-3 transition-colors hover:bg-white/[0.03]"
      style={{ paddingLeft: 12 + depth * 18 }}
    >
      <Icon size={16} className="mt-1 shrink-0 text-neutral-500" />
      <div className="min-w-0 flex-1">
        <p className="font-medium tracking-tight">{node.title}</p>
        {node.summary ? <p className="mt-1 text-sm text-neutral-500">{node.summary}</p> : null}
      </div>
      {node.href ? <ChevronRight size={16} className="mt-1 text-neutral-600" /> : null}
    </div>
  )

  return (
    <div>
      {node.href ? (
        <Link
          href={node.href}
          target={node.href.startsWith("http") ? "_blank" : undefined}
          rel={node.href.startsWith("http") ? "noreferrer" : undefined}
        >
          {inner}
        </Link>
      ) : (
        inner
      )}
      {node.children.map((child) => (
        <NodeRow key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  )
}

export const metadata = {
  title: "Connection map · Bardlabs",
  description: "How disciplines, projects, and networks connect across the lab.",
}

export default async function MapPage() {
  const [nodes, links] = await Promise.all([fetchLabTree(), fetchSiteLinks()])
  const tree = buildTree(nodes)

  return (
    <main className="min-h-[100svh] bg-[#050505] px-4 pb-28 pt-28 text-white sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-neutral-500 hover:text-white"
        >
          <ArrowLeft size={14} />
          Lab
        </Link>

        <header className="mt-10 border-b border-white/10 pb-8">
          <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">Advantage</p>
          <h1 className="mt-2 text-4xl font-medium tracking-tight sm:text-5xl">
            Connecting dots
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base">
            One lab graph — disciplines, builds, and networks mapped so systems, software, and
            mechanics stay in the same conversation.
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

        <section className="mt-12 overflow-hidden border border-white/15">
          {tree.length === 0 ? (
            <p className="p-6 text-sm text-neutral-500">Tree is empty — seed it from the dashboard.</p>
          ) : (
            tree.map((node) => <NodeRow key={node.id} node={node} />)
          )}
        </section>
      </div>
    </main>
  )
}
