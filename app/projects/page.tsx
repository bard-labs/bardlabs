import { FeatureOff } from "@/components/FeatureOff"
import { isFeatureEnabled } from "@/lib/features-data"
import { getPublicProjects } from "@/lib/public-data"
import { ProjectsClient } from "./projects-client"

export default async function ProjectsPage() {
  if (!(await isFeatureEnabled("projects"))) {
    return <FeatureOff title="Offline" featureLabel="Projects" />
  }

  const projects = await getPublicProjects()
  return <ProjectsClient initialProjects={projects} />
}
