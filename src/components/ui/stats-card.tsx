import { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: number
  change?: {
    value: number
    label: string
    isPositive?: boolean
  }
  icon: LucideIcon
  className?: string
  iconColor?: string
  iconBgColor?: string
  formatValue?: (num: number) => string
  prefix?: string
  suffix?: string
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  className,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
  formatValue,
  prefix,
  suffix
}: StatsCardProps) {
  return (
    <Card className={cn("p-6 hover:border-primary/50 transition-all group cursor-pointer", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-lg group-hover:scale-110 transition-transform", iconBgColor)}>
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="text-3xl font-bold">
          <AnimatedCounter 
            value={value} 
            formatNumber={formatValue}
            prefix={prefix}
            suffix={suffix}
          />
        </div>
        {change && (
          <div className="flex items-center gap-1 text-xs">
            <span className={cn(
              "font-medium",
              change.isPositive !== false ? "text-success" : "text-destructive"
            )}>
              {change.isPositive !== false ? "+" : ""}{change.value}
            </span>
            <span className="text-muted-foreground">{change.label}</span>
          </div>
        )}
      </div>
    </Card>
  )
}