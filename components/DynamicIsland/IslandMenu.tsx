"use client"
import React, { useMemo, useRef } from "react"
import { Home, Folder, FileText, Brain, Mail, Network } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useSiteFeatures } from "@/hooks/use-site-features"
import type { FeatureId } from "@/lib/features"

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  active?: boolean
  delay?: number
}

const MenuItem = ({
  icon,
  label,
  onClick,
  active = false,
  delay = 0,
  variant = "vertical",
}: MenuItemProps & { variant?: "vertical" | "horizontal" }) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        delay: delay / 1000,
        ease: "back.out(1.7)",
      },
    )
  }, { scope: buttonRef })

  if (variant === "horizontal") {
    return (
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        className={`
            w-full flex items-center gap-3 p-3 rounded-2xl transition-colors duration-300
            ${active ? "bg-white/10 text-white" : "hover:bg-white/5 text-neutral-400 hover:text-neutral-200"}
            active:scale-95
          `}
      >
        <div className={`rounded-full p-2 transition-colors ${active ? "bg-white text-black" : "bg-neutral-800"}`}>
          {icon}
        </div>
        <span className="text-xs font-medium">{label}</span>
      </button>
    )
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`
        flex flex-col items-center justify-center gap-2 p-2 rounded-2xl transition-colors duration-300
        ${active ? "bg-white/10 text-white" : "hover:bg-white/5 text-neutral-400 hover:text-neutral-200"}
        active:scale-95
      `}
    >
      <div className={`rounded-full p-2 transition-colors ${active ? "bg-white text-black" : "bg-neutral-800"}`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}

interface IslandMenuProps {
  onNavigate: (label: string) => void
  onCollapse: () => void
}

const FEATURE_ITEMS: {
  feature?: FeatureId
  icon: React.ReactNode
  label: string
  navigate: string
}[] = [
  { icon: <Home size={20} />, label: "Home", navigate: "Home" },
  { feature: "projects", icon: <Folder size={20} />, label: "Projects", navigate: "Projects" },
  { feature: "map", icon: <Network size={20} />, label: "Map", navigate: "Map" },
  { feature: "logs", icon: <FileText size={20} />, label: "Logs", navigate: "Logs" },
  { feature: "brain", icon: <Brain size={20} />, label: "Brain", navigate: "Brain" },
]

export const IslandMenu = ({ onNavigate, onCollapse }: IslandMenuProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { enabled } = useSiteFeatures()

  const items = useMemo(
    () => FEATURE_ITEMS.filter((item) => !item.feature || enabled(item.feature)),
    [enabled],
  )

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.9, filter: "blur(10px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.4, ease: "power3.out" },
    )
  }, { scope: containerRef })

  const cols = Math.min(4, Math.max(2, items.length))

  return (
    <div ref={containerRef} className="flex h-full w-full flex-col justify-between p-3">
      <div className="mb-4 flex items-center justify-between">
        <span className="px-2 text-xs font-medium tracking-wider text-neutral-400 uppercase">Menu</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onCollapse()
          }}
          className="rounded-full p-1 transition-colors hover:bg-neutral-800"
        >
          <div className="h-1 w-8 rounded-full bg-neutral-700" />
        </button>
      </div>

      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {items.map((item) => (
          <MenuItem
            key={item.navigate}
            icon={item.icon}
            label={item.label}
            onClick={() => onNavigate(item.navigate)}
          />
        ))}
      </div>

      <div className="mt-2">
        <MenuItem
          icon={<Mail size={20} />}
          label="Contact Me"
          onClick={() => onNavigate("Contact")}
          variant="horizontal"
          delay={100}
        />
      </div>
    </div>
  )
}
