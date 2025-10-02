import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import QRCode from "react-qr-code";
import { 
  ArrowLeft, Mail, Phone, MapPin, Calendar, Star, 
  Video, CheckCircle, Briefcase, Award, Shield,
  Download, Share2, Copy, Youtube,
  User, Users, Eye
} from "lucide-react";

const TestProfile = () => {
  const employee = {
    id: "kanish-sj",
    name: "Kanish SJ",
    role: "Lead Developer & Channel Manager",
    department: "Technology",
    email: "kanish.sj@tomoacademy.com",
    phone: "+91 98765 43210",
    employeeId: "TOMO-001",
    joinDate: "2020-01-15",
    avatar: "KS",
    location: "Chennai, India",
    availability: "available",
    stats: { videos: 28, tasks: 165, rating: 4.9, projects: 24 },
    bio: "Full-stack developer and channel manager leading the technical vision for TOMO Academy."
  };

  const qrData = `https://tomo-forge-hub.vercel.app/test-profile`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/team">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src="/TOMO.svg" 
                alt="TOMO Academy"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.style.display = 'block';
                }}
              />
              <Youtube className="w-6 h-6 text-primary hidden" />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold">TOMO Academy</h1>
              <p className="text-white/90">Employee Profile - TEST PAGE</p>
            </div>
          </div>

          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-4xl border-4 border-white shadow-lg mx-auto mb-4">
              {employee.avatar}
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{employee.name}</h1>
            <p className="text-xl text-white/90 mb-3">{employee.role}</p>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {employee.department}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">✅ Profile Page Working!</h2>
          <p className="text-muted-foreground">
            This confirms that the routing is working correctly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Employee Info */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Employee Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Employee ID</p>
                  <p className="text-sm text-muted-foreground font-mono">{employee.employeeId}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{employee.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{employee.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{employee.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Join Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(employee.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* QR Code */}
          <Card className="p-6 text-center">
            <h3 className="text-xl font-bold mb-4">Profile QR Code</h3>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white rounded-lg shadow-lg">
                <QRCode
                  value={qrData}
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Scan this QR code to test the functionality
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigator.clipboard.writeText(qrData)}>
                <Copy className="w-4 h-4 mr-2" />
                Copy URL
              </Button>
              <Link to="/team">
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Back to Team
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Performance Stats */}
        <Card className="p-6 mt-8">
          <h3 className="text-xl font-bold mb-4">Performance Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <Video className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{employee.stats.videos}</div>
              <div className="text-sm text-muted-foreground">Videos</div>
            </div>
            
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold">{employee.stats.tasks}</div>
              <div className="text-sm text-muted-foreground">Tasks</div>
            </div>
            
            <div className="text-center p-4 bg-accent/10 rounded-lg">
              <Briefcase className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">{employee.stats.projects}</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            
            <div className="text-center p-4 bg-warning/10 rounded-lg">
              <Star className="w-8 h-8 text-warning mx-auto mb-2" />
              <div className="text-2xl font-bold">{employee.stats.rating}</div>
              <div className="text-sm text-muted-foreground">Rating</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TestProfile;