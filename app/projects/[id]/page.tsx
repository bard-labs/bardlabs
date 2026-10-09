import { FeatureOff } from "@/components/FeatureOff"
import { isFeatureEnabled } from "@/lib/features-data"
import { ProjectDetailClient } from "./project-detail-client"

export default async function ProjectDetailPage() {
  if (!(await isFeatureEnabled("projects"))) {
    return <FeatureOff title="Offline" featureLabel="Archive" />
  }

  return <ProjectDetailClient />
}
