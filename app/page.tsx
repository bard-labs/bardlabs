import { HomeExperience } from "@/components/Lab/HomeExperience"
import { getPublicOverview, getPublicProjects, getPublicSiteLinks } from "@/lib/public-data"

export default async function Home() {
  const [overview, links, projects] = await Promise.all([
    getPublicOverview(),
    getPublicSiteLinks(),
    getPublicProjects(),
  ])

  const snapshot = {
    completed: projects
      .filter((project) => project.status === "done")
      .map((project) => ({ id: project.id, title: project.title })),
    active: projects.filter((project) => project.status === "active").length,
    paused: projects.filter((project) => project.status === "paused").length,
  }

  return <HomeExperience overview={overview} links={links} snapshot={snapshot} />
}
