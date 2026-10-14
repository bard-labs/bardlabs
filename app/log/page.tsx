import { FeatureOff } from "@/components/FeatureOff"
import { isFeatureEnabled } from "@/lib/features-data"
import { getPublicLogs } from "@/lib/public-data"
import { LogsClient } from "./logs-client"

export default async function LogsPage() {
  if (!(await isFeatureEnabled("logs"))) {
    return <FeatureOff title="Offline" featureLabel="Logs" />
  }

  const logs = await getPublicLogs()
  return <LogsClient initialLogs={logs} />
}
