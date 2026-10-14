import { FeatureOff } from "@/components/FeatureOff"
import { isFeatureEnabled } from "@/lib/features-data"
import { getPublicBrain } from "@/lib/public-data"
import { BrainClient } from "./brain-client"

export default async function BrainPage() {
  if (!(await isFeatureEnabled("brain"))) {
    return <FeatureOff title="Offline" featureLabel="Brain" />
  }

  const brain = await getPublicBrain()
  return <BrainClient {...brain} />
}
