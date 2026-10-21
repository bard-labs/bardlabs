export const LAB_IDENTITY =
  "I'm Bardia Mardan. Bardlabs is my personal identity lab: a digital space for who I am, how I think, what I build, what I investigate, and the intersections between those interests."

export type LabTurn = {
  when: string
  title: string
  line: string
}

/** A few turns from the longer record, written as short lines. */
export const labTurns: LabTurn[] = [
  {
    when: "2019",
    title: "Hardware",
    line: "Arduino, and the first time software touched a physical device.",
  },
  {
    when: "2020",
    title: "Software",
    line: "Applications, backends, and the start of building systems.",
  },
  {
    when: "2023",
    title: "Applied work",
    line: "Trading logic and smaller systems that had to run. Occasional work, across more than one idea.",
  },
  {
    when: "2024",
    title: "Hardware, again",
    line: "ESP32, connected devices, and embedded systems.",
  },
  {
    when: "2025",
    title: "Inquiry, and a place to hold it",
    line: "Aerospace research, infrastructure, and the first Bardlabs: one place for interests that keep moving.",
  },
  {
    when: "2026",
    title: "The lab, still many threads",
    line: "Hardware design, research, software, and a way of building with AI in the loop. Clearer, and still a range.",
  },
]

export type LabQuestion = {
  question: string
  answer: string
}

export const labQuestions: LabQuestion[] = [
  {
    question: "Who is this?",
    answer: LAB_IDENTITY,
  },
  {
    question: "What is Bardlabs?",
    answer:
      "A personal identity lab. It holds the entrepreneurial and polymathic side of the work: systems, hardware, mechanics, inquiry, flight, and the software that runs between them.",
  },
  {
    question: "Where are you?",
    answer: "Iran.",
  },
  {
    question: "How does this relate to the portfolio?",
    answer:
      "bardiamardan.xyz is the portfolio, the web work. Bardlabs is the lab. The two stay separate so each one can be what it is.",
  },
  {
    question: "What do you work on?",
    answer:
      "Several things at once. Hardware, software, mechanics, research, and the places they cross. The lab is the record of that range.",
  },
  {
    question: "Where should I start?",
    answer:
      "The fields, for the range. The brain, for how the ideas connect. Projects, for what got built inside the lab. The portfolio, if you came for the web work.",
  },
]

/** Saved in the dashboard before the lab had its own sentence. Hidden so the card does not say two different things. */
export const LEGACY_LAB_SUMMARY =
  "Bardlabs is the workshop for systems, software, mechanics, and inquiry. Projects are what got built. The brain is the map of ideas. The personal site lives apart from this lab."

export function linkNote(link: { url: string; label: string }): string | null {
  const url = link.url.toLowerCase()
  const label = link.label.toLowerCase()

  if (url.includes("bardiamardan.xyz") || label.includes("bardiamardan")) {
    return "The portfolio. Web work lives on its own site."
  }
  if (url.includes("github.com")) return "Code and experiments."
  if (url.includes("linkedin.com")) return "Work, in public."
  if (url.startsWith("mailto:") || label === "email" || label === "contact") {
    return "A direct note."
  }
  if (url === "/projects" || url.endsWith("/projects")) return "Work built inside the lab."
  if (url === "/brain" || url.endsWith("/brain")) return "How the interests connect."
  return null
}
