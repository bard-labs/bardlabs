"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  Link2,
  Network,
  Plus,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"

type LabNode = {
  id: string
  parent_id: string | null
  kind: "folder" | "discipline" | "project" | "link" | "note"
  title: string
  summary: string | null
  href: string | null
  ref_id: string | null
  sort_order: number
}

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

const kindIcon = {
  folder: Folder,
  discipline: Network,
  project: FileText,
  link: Link2,
  note: FileText,
} as const

export function LabTreeEditor() {
  const supabase = createClient()
  const [nodes, setNodes] = useState<LabNode[]>([])
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    "11111111-1111-1111-1111-111111111101": true,
  })
  const [form, setForm] = useState({
    parent_id: "",
    kind: "note" as LabNode["kind"],
    title: "",
    summary: "",
    href: "",
  })

  const fetchData = useCallback(async () => {
    const { data } = await supabase.from("lab_nodes").select("*").order("sort_order")
    if (data) setNodes(data as LabNode[])
  }, [supabase])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  const tree = useMemo(() => buildTree(nodes), [nodes])

  const addNode = async () => {
    if (!form.title) {
      toast.error("Title is required")
      return
    }
    const { error } = await supabase.from("lab_nodes").insert({
      parent_id: form.parent_id || null,
      kind: form.kind,
      title: form.title,
      summary: form.summary || null,
      href: form.href || null,
      sort_order: nodes.length * 10 + 10,
    })
    if (error) {
      toast.error("Could not add node", { description: error.message })
      return
    }
    toast.success("Tree node added")
    setForm({ parent_id: form.parent_id, kind: "note", title: "", summary: "", href: "" })
    fetchData()
  }

  const removeNode = async (id: string) => {
    if (!confirm("Delete this node and its children?")) return
    const { error } = await supabase.from("lab_nodes").delete().eq("id", id)
    if (error) {
      toast.error("Delete failed", { description: error.message })
      return
    }
    toast.success("Tree node deleted")
    fetchData()
  }

  const renderNode = (node: TreeNode, depth = 0) => {
    const Icon = node.kind === "folder" && openIds[node.id] ? FolderOpen : kindIcon[node.kind]
    const hasChildren = node.children.length > 0
    const expanded = openIds[node.id]

    return (
      <div key={node.id}>
        <div
          className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/5"
          style={{ paddingLeft: 8 + depth * 14 }}
        >
          <button
            type="button"
            className="text-neutral-500"
            onClick={() => setOpenIds((s) => ({ ...s, [node.id]: !s[node.id] }))}
            aria-label="Toggle"
          >
            {hasChildren ? (
              expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
            ) : (
              <span className="inline-block w-3.5" />
            )}
          </button>
          <Icon size={14} className="shrink-0 text-neutral-400" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{node.title}</p>
            {node.summary ? (
              <p className="truncate text-[11px] text-neutral-500">{node.summary}</p>
            ) : null}
          </div>
          <button
            type="button"
            className="rounded p-1 text-neutral-600 opacity-0 hover:bg-white/10 hover:text-white group-hover:opacity-100"
            onClick={() => setForm((f) => ({ ...f, parent_id: node.id }))}
            title="Add child"
          >
            <Plus size={14} />
          </button>
          <button
            type="button"
            className="rounded p-1 text-red-400 opacity-0 hover:bg-white/10 group-hover:opacity-100"
            onClick={() => removeNode(node.id)}
          >
            <Trash2 size={14} />
          </button>
        </div>
        {expanded ? node.children.map((c) => renderNode(c, depth + 1)) : null}
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-white/5 bg-neutral-900/50 p-6">
      <h2 className="mb-2 flex items-center gap-2 text-xl font-medium">
        <Network size={20} className="text-violet-400" />
        Connection tree
      </h2>
      <p className="mb-6 text-sm text-neutral-500">
        Filetree of how disciplines, projects, and links map together.
      </p>

      <ScrollArea className="mb-6 h-[360px] rounded-2xl border border-white/5 bg-black/30 p-2">
        {tree.map((n) => renderNode(n))}
        {tree.length === 0 ? (
          <p className="p-4 text-sm text-neutral-500">No data found</p>
        ) : null}
      </ScrollArea>

      <div className="grid gap-2 sm:grid-cols-2">
        <select
          className="rounded-lg bg-neutral-800 px-3 py-2 text-sm"
          value={form.parent_id}
          onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
        >
          <option value="">Root</option>
          {nodes.map((n) => (
            <option key={n.id} value={n.id}>
              {n.title}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg bg-neutral-800 px-3 py-2 text-sm"
          value={form.kind}
          onChange={(e) => setForm({ ...form, kind: e.target.value as LabNode["kind"] })}
        >
          <option value="folder">folder</option>
          <option value="discipline">discipline</option>
          <option value="project">project</option>
          <option value="link">link</option>
          <option value="note">note</option>
        </select>
        <input
          className="rounded-lg bg-neutral-800 px-3 py-2 text-sm sm:col-span-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="rounded-lg bg-neutral-800 px-3 py-2 text-sm sm:col-span-2"
          placeholder="Summary (optional)"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
        />
        <input
          className="rounded-lg bg-neutral-800 px-3 py-2 text-sm sm:col-span-2"
          placeholder="Href / URL (optional)"
          value={form.href}
          onChange={(e) => setForm({ ...form, href: e.target.value })}
        />
        <button
          onClick={addNode}
          className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium hover:bg-violet-500 sm:col-span-2"
        >
          <Plus size={16} /> Add to tree
        </button>
      </div>
    </div>
  )
}
