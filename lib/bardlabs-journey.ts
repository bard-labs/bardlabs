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

export const BARDLABS_JOURNEY_TITLE = "Bardlabs — A Map of Work & Obsessions"

export const bardlabsJourney: JourneyMilestone[] = [
  {
    id: "2019-hardware",
    when: "2019",
    title: "First Hardware Experiments",
    category: "Hardware · Origins",
    content:
      "Started experimenting with Arduino as a child, exploring the connection between software and physical devices.",
  },
  {
    id: "2020-software",
    when: "~2020",
    title: "Software & Web Development",
    category: "Software · Web",
    content:
      "Began exploring web development and Python-based backend development, gradually expanding into full-stack applications, APIs, and databases.",
  },
  {
    id: "2022-bots",
    when: "2022–2024",
    title: "Bots & Digital Experiments",
    category: "Automation · Software",
    content:
      "Built and experimented with Discord bots and smaller digital projects, exploring how software could automate tasks and connect services.",
  },
  {
    id: "2023-trading",
    when: "2023–2024",
    title: "Trading Systems",
    category: "Applied Engineering",
    content:
      "Worked on trading indicators, translating strategy requirements into executable logic. This remains an occasional area of work rather than a single continuous project.",
  },
  {
    id: "2024-hardware-return",
    when: "2024",
    title: "Return to Hardware",
    category: "Embedded Systems · IoT",
    content:
      "Returned to hardware after several years away, this time exploring ESP32, connected devices, and broader embedded systems.",
  },
  {
    id: "2025-early-web",
    when: "Early 2025",
    title: "Interactive Web & Motion",
    category: "Creative Engineering",
    content:
      "Explored Three.js, followed by GSAP and animation, investigating how motion and interaction can communicate ideas through web experiences.",
  },
  {
    id: "2025-infra",
    when: "Mid-2025",
    title: "Infrastructure & Systems",
    category: "Systems Engineering · Infrastructure",
    content:
      "Expanded into infrastructure, deployment, and system architecture, exploring how services and components fit together beyond individual applications.",
  },
  {
    id: "2025-automation",
    when: "Summer 2025",
    title: "Automation & Workflows",
    category: "Automation · Integrations",
    content:
      "Explored n8n, workflow automation, and integrations, connecting services and automating processes.",
  },
  {
    id: "2025-aerospace",
    when: "2025",
    title: "Aerospace Research",
    category: "Research · Aerospace",
    content:
      "Developed an interest in aerospace history, the technical concepts behind aerospace and military systems, and drone-related technologies.",
  },
  {
    id: "2025-bardlabs-v1",
    when: "November 2025",
    title: "Bardlabs, First Iteration",
    category: "Personal Project · Identity",
    content:
      "The first version of Bardlabs took shape as a personal technical identity and space for projects, experiments, and evolving interests.",
  },
  {
    id: "2026-heimdall-start",
    when: "January 2026",
    title: "Heimdall Begins",
    category: "Industrial IoT · Systems Engineering",
    content:
      "Started Heimdall, an industrial IoT system exploring device telemetry, communication, provisioning, and control architecture.",
  },
  {
    id: "2026-connection-lost",
    when: "January 8, 2026",
    title: "Connection Lost",
    category: "Interruption · Iran",
    content:
      "Iran’s internet blackout interrupted the work surrounding Heimdall.",
    status: "terminated",
  },
  {
    id: "2026-another-interruption",
    when: "February 28, 2026",
    title: "Another Interruption",
    category: "Interruption · War",
    content:
      "A second major interruption began amid the Iran–US war. Internet access remained disrupted for more than 40 days. Distinct from January’s outage — not one continuous blackout.",
    status: "terminated",
  },
  {
    id: "2026-hardware-design",
    when: "2026",
    title: "Hardware Design Expands",
    category: "Electronics · Design",
    content:
      "Expanded hardware interests into PCB design and 3D design, extending the exploration of physical systems beyond embedded software.",
  },
  {
    id: "2026-heimdall-resume",
    when: "May 2026",
    title: "Heimdall Resumes",
    category: "Industrial IoT · Systems Engineering",
    content:
      "Returned to Heimdall after the interruptions, revisiting the project and continuing its development.",
  },
  {
    id: "2026-ai-engineering",
    when: "2026",
    title: "AI-Directed Engineering",
    category: "Engineering Methodology · AI",
    content:
      "Developed a workflow centered on AI-assisted software engineering: directing implementation, evaluating architecture, inspecting generated code, investigating failures, and iterating toward correct behavior. Ongoing methodology — not a finished project.",
  },
  {
    id: "2026-bardlabs-v2",
    when: "October 2026",
    title: "Bardlabs, Second Iteration",
    category: "Personal Project · Evolution",
    content:
      "Bardlabs enters a new iteration: a clearer map of the work, systems, and technical obsessions that have accumulated over time.",
  },
]
