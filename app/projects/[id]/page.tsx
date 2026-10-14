import { notFound } from "next/navigation"
import { FeatureOff } from "@/components/FeatureOff"
import { isFeatureEnabled } from "@/lib/features-data"
import { getPublicProjectDetail } from "@/lib/public-data"
import { ProjectDetailClient } from "./project-detail-client"

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isFeatureEnabled("projects"))) {
    return <FeatureOff title="Offline" featureLabel="Archive" />
  }

  const { id } = await params
  const { project, disciplines } = await getPublicProjectDetail(id)
  if (!project) notFound()

  return <ProjectDetailClient initialProject={project} initialDisciplines={disciplines} />
}
