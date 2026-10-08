export type LabLink = {
  id: string
  title: string
  subtitle: string
  href: string
  span: string
}

/** Uneven Swiss grid used when the overlay opens away from the hero. */
export const labNavCells: LabLink[] = [
  {
    id: "systems",
    title: "Systems",
    subtitle: "IoT · Embedded · Hardware",
    href: "/projects",
    span: "col-span-4 md:col-span-4",
  },
  {
    id: "intelligence",
    title: "Intelligence",
    subtitle: "Software · AI · Automation",
    href: "/projects",
    span: "col-span-4 md:col-span-8",
  },
  {
    id: "mechanics",
    title: "Mechanics",
    subtitle: "Robots · Motion · Control",
    href: "/projects",
    span: "col-span-4 md:col-span-3",
  },
  {
    id: "inquiry",
    title: "Inquiry",
    subtitle: "Physics · Study · Theory",
    href: "/brain",
    span: "col-span-4 md:col-span-3",
  },
  {
    id: "flight",
    title: "Flight",
    subtitle: "Aerospace · Avionics",
    href: "/projects",
    span: "col-span-4 md:col-span-6",
  },
  {
    id: "surfaces",
    title: "Surfaces",
    subtitle: "Interfaces · Aesthetic web",
    href: "/projects",
    span: "col-span-4 md:col-span-8",
  },
  {
    id: "archive",
    title: "Archive",
    subtitle: "Project Universe",
    href: "/projects",
    span: "col-span-4 md:col-span-4",
  },
]

export const skillWheelItems = [
  {
    label: "Embedded Systems",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Circuit board macro",
  },
  {
    label: "IoT Networks",
    image:
      "https://images.unsplash.com/photo-1558346490-a3598da6bb45?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Connected devices",
  },
  {
    label: "Intelligent Software",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Code on a screen",
  },
  {
    label: "AI & Automation",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Abstract AI visualization",
  },
  {
    label: "Mechanics & Robotics",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Robot arm",
  },
  {
    label: "Aerospace Systems",
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Earth from orbit",
  },
  {
    label: "Physical Inquiry",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Physics chalkboard",
  },
  {
    label: "Interface Craft",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Design workspace",
  },
]
