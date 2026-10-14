"use client"

import { GalaxyBrain, type GalaxyBrainProps } from "@/components/Brain/GalaxyBrain"

export function BrainClient(props: GalaxyBrainProps) {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-black">
      <GalaxyBrain {...props} />
    </main>
  )
}
