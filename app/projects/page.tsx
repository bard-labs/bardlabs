import { FeatureOff } from "@/components/FeatureOff"
import { isFeatureEnabled } from "@/lib/features-data"
import { ProjectsClient } from "./projects-client"

export default async function ProjectsPage() {
  if (!(await isFeatureEnabled("projects"))) {
    return <FeatureOff title="Offline" featureLabel="Archive" />
  }

  return <ProjectsClient />
}
