import Link from "next/link"
import GlowHero from "@/components/ui/hero-1"

export function FeatureOff({
  title = "Offline",
  featureLabel,
}: {
  title?: string
  featureLabel?: string
}) {
  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_55%)]" />

      <GlowHero
        label="Bardlabs"
        glowText={title}
        labelSize="sm"
        glowTextSize="lg"
        className="relative z-10"
      />
      <p className="relative z-10 mt-6 max-w-sm text-center text-sm tracking-wide text-neutral-500">
        {featureLabel ? `${featureLabel} is off` : "This feature is off"}
      </p>
      <Link
        href="/"
        className="relative z-10 mt-10 text-[11px] uppercase tracking-[0.28em] text-neutral-500 transition-colors hover:text-white"
      >
        Return
      </Link>
    </main>
  )
}
