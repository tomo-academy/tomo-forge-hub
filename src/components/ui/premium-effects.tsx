import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FloatingElementsProps {
  className?: string;
  count?: number;
}

export function FloatingElements({ className, count = 6 }: FloatingElementsProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

interface ParticleBackgroundProps {
  className?: string;
  particleCount?: number;
}

export function ParticleBackground({ className, particleCount = 50 }: ParticleBackgroundProps) {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; opacity: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setParticles(newParticles);
  }, [particleCount]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

interface GradientBorderProps {
  children: React.ReactNode;
  className?: string;
  gradientClassName?: string;
}

export function GradientBorder({ children, className, gradientClassName }: GradientBorderProps) {
  return (
    <div className={cn("relative p-[1px] rounded-lg", className)}>
      <div className={cn(
        "absolute inset-0 rounded-lg bg-gradient-to-r from-primary via-accent to-primary opacity-75 blur-sm",
        gradientClassName
      )} />
      <div className="relative bg-background rounded-lg">
        {children}
      </div>
    </div>
  );
}

interface MorphingShapeProps {
  className?: string;
  color?: string;
}

export function MorphingShape({ className, color = "primary" }: MorphingShapeProps) {
  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "absolute inset-0 rounded-full opacity-20 animate-morph",
        `bg-${color}`
      )} />
      <div className={cn(
        "absolute inset-0 rounded-full opacity-10 animate-morph-reverse",
        `bg-${color}`
      )} />
    </div>
  );
}

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export function TypewriterText({ text, className, speed = 100 }: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={cn("inline-block", className)}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

interface PulseRingProps {
  className?: string;
  color?: string;
}

export function PulseRing({ className, color = "primary" }: PulseRingProps) {
  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "absolute inset-0 rounded-full animate-ping",
        `bg-${color}`,
        "opacity-20"
      )} />
      <div className={cn(
        "absolute inset-0 rounded-full animate-pulse",
        `bg-${color}`,
        "opacity-40"
      )} />
      <div className={cn(
        "relative rounded-full",
        `bg-${color}`
      )} />
    </div>
  );
}

interface ShimmerEffectProps {
  className?: string;
}

export function ShimmerEffect({ className }: ShimmerEffectProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}

interface NeonGlowProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  intensity?: "low" | "medium" | "high";
}

export function NeonGlow({ children, className, color = "primary", intensity = "medium" }: NeonGlowProps) {
  const glowIntensity = {
    low: "drop-shadow-sm",
    medium: "drop-shadow-md",
    high: "drop-shadow-lg"
  };

  return (
    <div className={cn(
      "relative",
      glowIntensity[intensity],
      className
    )}>
      <div className={cn(
        "absolute inset-0 rounded-lg blur-md opacity-50",
        `bg-${color}`
      )} />
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

// Add these animations to your global CSS
export const premiumAnimations = `
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
}

@keyframes morph {
  0%, 100% { border-radius: 50% 50% 50% 50%; transform: rotate(0deg); }
  25% { border-radius: 60% 40% 30% 70%; transform: rotate(90deg); }
  50% { border-radius: 30% 70% 70% 30%; transform: rotate(180deg); }
  75% { border-radius: 40% 60% 50% 50%; transform: rotate(270deg); }
}

@keyframes morph-reverse {
  0%, 100% { border-radius: 30% 70% 70% 30%; transform: rotate(360deg); }
  25% { border-radius: 50% 50% 50% 50%; transform: rotate(270deg); }
  50% { border-radius: 60% 40% 30% 70%; transform: rotate(180deg); }
  75% { border-radius: 70% 30% 50% 50%; transform: rotate(90deg); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-morph {
  animation: morph 8s ease-in-out infinite;
}

.animate-morph-reverse {
  animation: morph-reverse 8s ease-in-out infinite reverse;
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`;