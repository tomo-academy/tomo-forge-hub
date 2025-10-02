import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

export function ProgressRing({ 
  value, 
  max = 100, 
  size = 120, 
  strokeWidth = 8, 
  className,
  children 
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (value / max) * 100;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary transition-all duration-1000 ease-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

interface MiniBarChartProps {
  data: ChartData[];
  height?: number;
  className?: string;
}

export function MiniBarChart({ data, height = 60, className }: MiniBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className={cn("flex items-end gap-1", className)} style={{ height }}>
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * height;
        return (
          <div
            key={index}
            className="flex-1 bg-primary/20 rounded-t-sm relative group transition-all hover:bg-primary/40"
            style={{ height: barHeight }}
          >
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg">
                {item.label}: {item.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface DonutChartProps {
  data: ChartData[];
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabels?: boolean;
}

export function DonutChart({ 
  data, 
  size = 200, 
  strokeWidth = 20, 
  className,
  showLabels = true 
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--accent))',
    'hsl(var(--success))',
    'hsl(var(--warning))',
    'hsl(var(--destructive))',
    'hsl(var(--muted-foreground))',
  ];

  let cumulativePercentage = 0;

  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativePercentage * circumference / 100;
    
    cumulativePercentage += percentage;

    return {
      ...item,
      percentage,
      strokeDasharray,
      strokeDashoffset,
      color: item.color || colors[index % colors.length],
    };
  });

  return (
    <div className={cn("flex items-center gap-6", className)}>
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {segments.map((segment, index) => (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={segment.color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={segment.strokeDasharray}
              strokeDashoffset={segment.strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
        </div>
      </div>

      {showLabels && (
        <div className="space-y-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-muted-foreground">{segment.label}</span>
              <span className="font-medium ml-auto">
                {segment.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface TrendLineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}

export function TrendLine({ 
  data, 
  width = 200, 
  height = 60, 
  className,
  color = "hsl(var(--primary))" 
}: TrendLineProps) {
  const points = useMemo(() => {
    if (data.length === 0) return "";
    
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    
    return data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - minValue) / range) * height;
        return `${x},${y}`;
      })
      .join(" ");
  }, [data, width, height]);

  const isPositiveTrend = data.length > 1 && data[data.length - 1] > data[0];

  return (
    <div className={cn("relative", className)}>
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          fill="url(#trendGradient)"
          points={`0,${height} ${points} ${width},${height}`}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className={cn(
        "absolute top-0 right-0 text-xs px-2 py-1 rounded",
        isPositiveTrend ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
      )}>
        {isPositiveTrend ? "↗" : "↘"}
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  trend?: number[];
  className?: string;
}

export function MetricCard({ title, value, change, trend, className }: MetricCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {trend && <TrendLine data={trend} width={60} height={20} />}
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold">{value}</div>
          {change && (
            <div className="flex items-center gap-1 text-sm">
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
      </div>
    </Card>
  );
}