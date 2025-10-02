import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatedCard, GlowCard } from "@/components/ui/animated-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { FloatingElements, ParticleBackground, TypewriterText } from "@/components/ui/premium-effects";
import { ArrowRight, Users, Video, CheckCircle, BarChart3, Shield, Zap, Sparkles, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import heroBg from "@/assets/hero-bg.jpg";

const Home = () => {
  const features = [
    {
      icon: Users,
      title: "Team Management",
      description: "Digital employee profiles with ID cards and QR codes for seamless identity verification",
    },
    {
      icon: Video,
      title: "Content Hub",
      description: "Track YouTube uploads, scheduling, and performance metrics in one centralized dashboard",
    },
    {
      icon: CheckCircle,
      title: "Task Board",
      description: "Kanban-style project management with assignments, deadlines, and progress tracking",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Comprehensive insights into channel performance, team productivity, and content metrics",
    },
    {
      icon: Shield,
      title: "Secure Access",
      description: "Role-based permissions with Firebase authentication and audit trails",
    },
    {
      icon: Zap,
      title: "Automation",
      description: "Automated workflows for onboarding, notifications, and reporting",
    },
  ];

  const stats = [
    { value: 14, label: "Team Members", suffix: "+" },
    { value: 234, label: "Videos Managed" },
    { value: 125000, label: "Subscribers", formatNumber: (num: number) => (num / 1000).toFixed(0) + "K+" },
    { value: 99.9, label: "Uptime", suffix: "%" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <ParticleBackground className="opacity-30" />
        <FloatingElements />
        <div 
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background z-0" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary animate-pulse-glow">
              <Sparkles className="w-4 h-4 animate-spin" />
              Premium Digital Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <TypewriterText text="Empowering" className="inline-block" />
              <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient"> TOMO Academy</span>
              <br />
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Content Creation
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive internal platform designed to streamline operations, 
              manage our team of 14+ creators, and optimize our YouTube channel's success.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary-hover shadow-glow text-lg px-8">
                  Access Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/team">
                <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                  View Team
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
            {stats.map((stat, index) => (
              <AnimatedCard key={index} hoverEffect="glow" className="p-6 text-center bg-card/50 backdrop-blur border-border">
                <div className="text-4xl font-bold text-primary">
                  <AnimatedCounter 
                    value={stat.value} 
                    formatNumber={stat.formatNumber}
                    suffix={stat.suffix}
                    duration={2000 + index * 200}
                  />
                </div>
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to <span className="text-primary">Succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built specifically for TOMO Academy's workflow with powerful features 
              to manage content, team, and growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <AnimatedCard 
                key={index}
                hoverEffect="lift"
                className="p-6 group cursor-pointer relative overflow-hidden"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors">{feature.description}</p>
                
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {/* Floating icon on hover */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                  <feature.icon className="w-8 h-8 text-primary animate-float" />
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <GlowCard glowColor="primary" className="p-12 text-center relative overflow-hidden">
            <FloatingElements count={8} className="opacity-20" />
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Access your personalized dashboard and start managing your workflow today.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover shadow-glow text-lg px-8 animate-pulse-glow">
                <TrendingUp className="mr-2 w-5 h-5" />
                Launch Platform
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </GlowCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>© 2025 TOMO Academy. All rights reserved.</p>
          <p className="text-sm mt-2">
            Internal Platform • YouTube Channel ID: UCMTpEQrAqzibxN6gZDLIDpA
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
