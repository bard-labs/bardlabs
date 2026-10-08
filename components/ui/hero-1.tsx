import React from "react"
import { cn } from "@/lib/utils"

interface GlowHeroProps {
  label?: string
  glowText: string
  labelSize?: "sm" | "md" | "lg"
  glowTextSize?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const GlowHero: React.FC<GlowHeroProps> = ({
  label,
  glowText,
  labelSize = "md",
  glowTextSize = "lg",
  className = "",
}) => {
  const labelSizeClasses = {
    sm: "text-xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl",
  }

  const glowTextSizeClasses = {
    sm: "text-3xl md:text-4xl",
    md: "text-4xl md:text-5xl",
    lg: "text-5xl md:text-6xl",
    xl: "text-6xl md:text-7xl",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      {label && (
        <div
          className={cn(
            labelSizeClasses[labelSize],
            "mb-4 text-center font-medium text-neutral-400 transition-opacity duration-300 ease-out",
          )}
        >
          {label}
        </div>
      )}
      <div className="relative">
        <div
          className={cn(
            "glow-text relative z-10 text-center font-medium tracking-tight text-white brightness-110",
            glowTextSizeClasses[glowTextSize],
          )}
          data-text={glowText}
        >
          {glowText}
        </div>
      </div>
    </div>
  )
}

export default GlowHero
