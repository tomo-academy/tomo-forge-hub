import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, Video, CheckCircle, BarChart3, Shield, Zap } from "lucide-react";
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
    { value: "14+", label: "Team Members" },
    { value: "234", label: "Videos Managed" },
    { value: "125K+", label: "Subscribers" },
    { value: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 gradient-hero z-0" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
              <Zap className="w-4 h-4" />
              Internal Digital Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Empowering
              <span className="text-primary"> TOMO Academy</span>
              <br />
              Content Creation
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
              <Card key={index} className="p-6 text-center bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
              </Card>
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
              <Card 
                key={index}
                className="p-6 hover:border-primary/50 hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-primary/20 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Access your personalized dashboard and start managing your workflow today.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary-hover shadow-glow text-lg px-8">
                Launch Platform
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </Card>
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
