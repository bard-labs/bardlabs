/**
 * Bardlabs journey milestones — seed for timeline UI now,
 * intended to move into Supabase later.
 */

export type JourneyStatus = "normal" | "terminated"

export type JourneyMilestone = {
  id: string
  when: string
  title: string
  category: string
  content: string
  status?: JourneyStatus
}

export const BARDLABS_JOURNEY_TITLE = "The path so far"

export const bardlabsJourney: JourneyMilestone[] = [
  {
    id: "2019-hardware",
    when: "2019",
    title: "First Hardware Experiments",
    category: "Hardware · Origins",
    content: "Arduino experiments, and the first link between software and physical devices.",
  },
  {
    id: "2020-software",
    when: "~2020",
    title: "Software & Web Development",
    category: "Software · Web",
    content: "Web development and Python backends, then full-stack applications, APIs, and databases.",
  },
  {
    id: "2022-bots",
    when: "2022–2024",
    title: "Bots & Digital Experiments",
    category: "Automation · Software",
    content: "Discord bots and smaller digital projects that automated tasks and connected services.",
  },
  {
    id: "2023-trading",
    when: "2023–2024",
    title: "Trading Systems",
    category: "Applied Engineering",
    content: "Trading indicators — strategy turned into executable logic. Occasional work, not one continuous project.",
  },
  {
    id: "2024-hardware-return",
    when: "2024",
    title: "Return to Hardware",
    category: "Embedded Systems · IoT",
    content: "Back to hardware: ESP32, connected devices, and embedded systems.",
  },
  {
    id: "2025-early-web",
    when: "Early 2025",
    title: "Interactive Web & Motion",
    category: "Creative Engineering",
    content: "Three.js, then GSAP — motion and interaction as a way to explain an idea.",
  },
  {
    id: "2025-infra",
    when: "Mid-2025",
    title: "Infrastructure & Systems",
    category: "Systems Engineering · Infrastructure",
    content: "Infrastructure, deployment, and how services fit together beyond a single app.",
  },
  {
    id: "2025-automation",
    when: "Summer 2025",
    title: "Automation & Workflows",
    category: "Automation · Integrations",
    content: "n8n, workflow automation, and integrations between services.",
  },
  {
    id: "2025-aerospace",
    when: "2025",
    title: "Aerospace Research",
    category: "Research · Aerospace",
    content: "Aerospace history, the technical ideas behind flight systems, and drone-related work.",
  },
  {
    id: "2025-bardlabs-v1",
    when: "November 2025",
    title: "Bardlabs, First Iteration",
    category: "Personal Project · Identity",
    content: "The first Bardlabs: a place for projects, experiments, and the interests that keep changing.",
  },
  {
    id: "2026-heimdall-start",
    when: "January 2026",
    title: "Heimdall Begins",
    category: "Industrial IoT · Systems Engineering",
    content:
      "Heimdall starts: industrial IoT for telemetry, communication, provisioning, and control.",
  },
  {
    id: "2026-hardware-design",
    when: "2026",
    title: "Hardware Design Expands",
    category: "Electronics · Design",
    content: "PCB design and 3D design, past embedded software and into the physical object.",
  },
  {
    id: "2026-heimdall-resume",
    when: "May 2026",
    title: "Heimdall Resumes",
    category: "Industrial IoT · Systems Engineering",
    content: "Back on Heimdall, continuing the system.",
  },
  {
    id: "2026-ai-engineering",
    when: "2026",
    title: "AI-Directed Engineering",
    category: "Engineering Methodology · AI",
    content: "A working method for AI-assisted engineering: direct, inspect, and iterate. A practice, not a finished project.",
  },
  {
    id: "2026-bardlabs-v2",
    when: "October 2026",
    title: "Bardlabs, Second Iteration",
    category: "Personal Project · Evolution",
    content: "A clearer Bardlabs — the work, the systems, and the interests in one place.",
  },
]
