import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedCard, GlowCard } from "@/components/ui/animated-card";
import { LoadingSpinnerOverlay } from "@/components/ui/loading-spinner";
import QRCode from "react-qr-code";
import { 
  ArrowLeft, Mail, Phone, MapPin, Calendar, Star, 
  Video, CheckCircle, Briefcase, Shield,
  Linkedin, Twitter, Github, Globe, Instagram,
  Download, Share2, Copy, Youtube,
  User, Building2, Users, Eye, BarChart3
} from "lucide-react";
import { allEmployees } from "@/data/employeesComplete";

const EmployeeProfile = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [employee, setEmployee] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Profile page loaded');
    console.log('Looking for employee ID:', employeeId);
    console.log('Available employees:', allEmployees.map(emp => emp.id));
    
    // Find employee by ID
    const foundEmployee = allEmployees.find(emp => emp.id === employeeId);
    console.log('Found employee:', foundEmployee);
    
    setEmployee(foundEmployee);
    setIsLoading(false);
  }, [employeeId]);

  if (isLoading) {
    return <LoadingSpinnerOverlay isLoading={true}><div className="h-screen" /></LoadingSpinnerOverlay>;
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-2xl">
          <h1 className="text-2xl font-bold mb-4">Employee Profile</h1>
          <p className="text-muted-foreground mb-6">
            Looking for employee ID: <code className="bg-muted px-2 py-1 rounded">{employeeId}</code>
          </p>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Available Employee IDs:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {allEmployees.map(emp => (
                <Link 
                  key={emp.id} 
                  to={`/profile/${emp.id}`}
                  className="p-2 bg-muted rounded hover:bg-primary/10 transition-colors"
                >
                  <div className="font-mono text-xs">{emp.id}</div>
                  <div className="text-xs text-muted-foreground">{emp.name}</div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Link to="/team">
              <Button>
                <Users className="w-4 h-4 mr-2" />
                View All Team Members
              </Button>
            </Link>
            <Link to={`/profile/${allEmployees[0].id}`}>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View Sample Profile
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const qrData = `https://tomo-forge-hub.vercel.app/profile/${employee.id}`;

  const getAvailabilityColor = () => {
    switch (employee.availability) {
      case 'available':
        return 'bg-success text-success-foreground';
      case 'busy':
        return 'bg-warning text-warning-foreground';
      case 'offline':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${employee.name}
ORG:TOMO Academy
TITLE:${employee.role}
EMAIL:${employee.email}
${employee.phone ? `TEL:${employee.phone}` : ''}
${employee.location ? `ADR:;;${employee.location};;;;` : ''}
NOTE:Employee ID: ${employee.employeeId} | Department: ${employee.department}
URL:https://tomoacademy.com/profile/${employee.id}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${employee.name.replace(/\s+/g, '_')}_TOMO_Academy.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const shareProfile = async () => {
    const shareData = {
      title: `${employee.name} - TOMO Academy`,
      text: `Check out ${employee.name}'s profile at TOMO Academy - ${employee.role}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
          {/* Navigation */}
          <div className="flex items-center gap-3 mb-6">
            <Link to="/team">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src="/TOMO.jpg" 
                alt="TOMO Academy"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const sibling = target.nextElementSibling as HTMLElement;
                  if (sibling) sibling.style.display = 'block';
                }}
              />
              <Youtube className="w-6 h-6 text-primary hidden" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold">TOMO Academy</h1>
              <p className="text-white/90 text-sm">Employee Profile</p>
            </div>
          </div>

          {/* Employee Info - Mobile Stacked */}
          <div className="text-center">
            {/* Employee Avatar */}
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-2xl md:text-4xl border-4 border-white shadow-lg overflow-hidden">
                {employee.avatar ? (
                  <img 
                    src={employee.avatar} 
                    alt={employee.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = employee.name.split(' ').map((n: string) => n[0]).join('');
                      }
                    }}
                  />
                ) : (
                  employee.name.split(' ').map((n: string) => n[0]).join('')
                )}
