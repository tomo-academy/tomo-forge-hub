import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  changeType?: "increase" | "decrease" | "neutral";
  trend?: number[];
  className?: string;
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  change,
  changeType = "neutral",
  trend,
  className,
}: StatsCardProps) {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      if (val >= 1000000) return (val / 1000000).toFixed(1) + "M";
      if (val >= 1000) return (val / 1000).toFixed(1) + "K";
      return val.toString();
    }
    return val;
  };

  return (
    <Card className={cn(
      "p-6 hover:border-primary/50 transition-all group cursor-pointer",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {trend && (
          <div className="flex items-center space-x-1 h-8">
            <svg width="60" height="32" className="text-primary/30">
              <polyline
                points={trend.map((value, index) => 
                  `${(index / (trend.length - 1)) * 60},${32 - (value / 100) * 32}`
                ).join(' ')}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="opacity-50"
              />
            </svg>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold">{formatValue(value)}</p>
          {change && (
            <Badge 
              variant="outline" 
              className={cn(
                "ml-2 text-xs",
                changeType === "increase" && "text-success border-success/20 bg-success/10",
                changeType === "decrease" && "text-destructive border-destructive/20 bg-destructive/10",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {changeType === "increase" && <TrendingUp className="w-3 h-3 mr-1" />}
              {changeType === "decrease" && <TrendingDown className="w-3 h-3 mr-1" />}
              {change}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}