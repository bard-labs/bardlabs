import type { LucideIcon } from "lucide-react"
import {
  Atom,
  Cpu,
  Layout,
  Orbit,
  Sparkles,
  Waves,
  Folder,
  Brain,
} from "lucide-react"

export type LabDiscipline = {
  id: string
  title: string
  subtitle: string
  summary: string
  href: string
  span: string
  icon: LucideIcon
}

export type LabLink = {
  id: string
  title: string
  subtitle: string
  href: string
  span: string
}

export const labDisciplines: LabDiscipline[] = [
  {
    id: "systems",
    title: "Systems",
    subtitle: "IoT · Embedded · Hardware",
    summary:
      "Boards, sensors, radios, and firmware that connect the physical world to software.",
    href: "/lab/systems",
    span: "col-span-4 md:col-span-4",
    icon: Cpu,
  },
  {
    id: "intelligence",
    title: "Intelligence",
    subtitle: "Software · AI · Automation",
    summary:
      "Product software, models, and automation loops that compound human effort.",
    href: "/lab/intelligence",
    span: "col-span-4 md:col-span-8",
    icon: Sparkles,
  },
  {
    id: "mechanics",
    title: "Mechanics",
    subtitle: "Robots · Motion · Control",
    summary:
      "Mechanisms, actuators, and control systems that move matter with intent.",
    href: "/lab/mechanics",
    span: "col-span-4 md:col-span-3",
    icon: Waves,
  },
  {
    id: "inquiry",
    title: "Inquiry",
    subtitle: "Physics · Study · Theory",
    summary:
      "First-principles study — physics, maths, and the notes that feed every build.",
    href: "/lab/inquiry",
    span: "col-span-4 md:col-span-3",
    icon: Atom,
  },
  {
    id: "flight",
    title: "Flight",
    subtitle: "Aerospace · Avionics",
    summary:
      "Structures, sensing, and avionics thinking applied to flight-adjacent systems.",
    href: "/lab/flight",
    span: "col-span-4 md:col-span-6",
    icon: Orbit,
  },
  {
    id: "surfaces",
    title: "Surfaces",
    subtitle: "Interfaces · Aesthetic web",
    summary:
      "Interfaces and aesthetic websites — software you can feel, not only use.",
    href: "/lab/surfaces",
    span: "col-span-4 md:col-span-8",
    icon: Layout,
  },
]

/** Uneven Swiss grid used in the Lab index overlay. */
export const labNavCells: LabLink[] = [
  ...labDisciplines.map(({ id, title, subtitle, href, span }) => ({
    id,
    title,
    subtitle,
    href,
    span,
  })),
  {
    id: "archive",
    title: "Archive",
    subtitle: "Project Universe",
    href: "/projects",
    span: "col-span-4 md:col-span-4",
  },
  {
    id: "map",
    title: "Connections",
    subtitle: "Graph of the lab",
    href: "/map",
    span: "col-span-4 md:col-span-4",
  },
  {
    id: "brain",
    title: "Brain",
    subtitle: "Knowledge map",
    href: "/brain",
    span: "col-span-4 md:col-span-4",
  },
]

export const skillOrbitItems = labDisciplines.map((d) => ({
  id: d.id,
  label: d.title,
  detail: d.subtitle,
  href: d.href,
  icon: d.icon,
}))

export const portalLinks = [
  { title: "Archive", subtitle: "Project Universe", href: "/projects", icon: Folder },
  { title: "The Brain", subtitle: "Interactive knowledge map", href: "/brain", icon: Brain },
]

export function getDiscipline(id: string) {
  return labDisciplines.find((d) => d.id === id)
}
