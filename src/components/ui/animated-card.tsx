import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  hoverEffect?: "lift" | "glow" | "scale" | "border"
  clickable?: boolean
  onClick?: () => void
}

export function AnimatedCard({ 
  children, 
  className, 
  hoverEffect = "lift",
  clickable = false,
  onClick 
}: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const hoverEffects = {
    lift: "hover:shadow-lg hover:-translate-y-1",
    glow: "hover:shadow-glow hover:border-primary/50",
    scale: "hover:scale-105",
    border: "hover:border-primary/50"
  }

  return (
    <Card
      className={cn(
        "transition-all duration-300 ease-out",
        hoverEffects[hoverEffect],
        clickable && "cursor-pointer",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </Card>
  )
}

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
}

export function GlowCard({ children, className, glowColor = "primary" }: GlowCardProps) {
  return (
    <div className={cn("relative group", className)}>
      <div className={cn(
        "absolute -inset-0.5 bg-gradient-to-r opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200",
        glowColor === "primary" && "from-primary to-accent",
        glowColor === "success" && "from-success to-accent", 
        glowColor === "warning" && "from-warning to-primary",
        glowColor === "destructive" && "from-destructive to-primary"
      )} />
      <Card className="relative bg-background">
        {children}
      </Card>
    </div>
  )
}

interface PulseCardProps {
  children: React.ReactNode
  className?: string
  pulseColor?: string
}

export function PulseCard({ children, className, pulseColor = "primary" }: PulseCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden",
      className
    )}>
      <div className={cn(
        "absolute inset-0 opacity-0 animate-pulse",
        pulseColor === "primary" && "bg-primary/5",
        pulseColor === "success" && "bg-success/5",
        pulseColor === "warning" && "bg-warning/5"
      )} />
      <div className="relative">
        {children}
      </div>
    </Card>
  )
}