import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  X, Plus, UserPlus, Save, AlertCircle, CheckCircle,
  Mail, Phone, MapPin, Calendar, Building2, User,
  Briefcase, Star, Video, CheckSquare
} from "lucide-react";
import { firebaseService } from "@/services/firebase";
import { cn } from "@/lib/utils";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberAdded: () => void;
}

interface NewMember {
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  availability: 'available' | 'busy' | 'offline';
  social: {
    linkedin: string;
    twitter: string;
    github: string;
    website: string;
    instagram: string;
  };
}

const departments = [
  'Technology',
  'Content Production',
  'Content Strategy',
  'Design',
  'Marketing',
  'Quality Assurance',
  'Finance'
];

const cardColors = ['primary', 'accent', 'success', 'warning', 'destructive'];

export function AddMemberModal({ isOpen, onClose, onMemberAdded }: AddMemberModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentSkill, setCurrentSkill] = useState('');

  const [formData, setFormData] = useState<NewMember>({
    name: '',
    role: '',
    department: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
    availability: 'available',
    social: {
      linkedin: '',
      twitter: '',
      github: '',
      website: '',
      instagram: ''
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      department: '',
      email: '',
      phone: '',
      location: '',
      bio: '',
      skills: [],
      availability: 'available',
      social: {
        linkedin: '',
        twitter: '',
        github: '',
        website: '',
        instagram: ''
      }
    });
    setCurrentSkill('');
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const generateEmployeeId = (name: string, department: string) => {
    const namePart = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const deptPart = department.split(' ')[0].substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 999) + 1;
    return `TOMO-${deptPart}-${namePart}-${randomNum.toString().padStart(3, '0')}`;
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.role.trim()) return 'Role is required';
    if (!formData.department) return 'Department is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
    if (formData.skills.length === 0) return 'At least one skill is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const employeeId = generateEmployeeId(formData.name, formData.department);
      const avatar = formData.name.split(' ').map(n => n[0]).join('').toUpperCase();
      
      // Generate random but realistic stats
      const stats = {
        videos: Math.floor(Math.random() * 50) + 1,
        tasks: Math.floor(Math.random() * 100) + 10,
        rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // 3.5-5.0 range
        projects: Math.floor(Math.random() * 30) + 5
      };

      const newEmployee = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        department: formData.department,
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        employeeId,
        joinDate: new Date().toISOString(),
        avatar,
        bio: formData.bio.trim() || undefined,
        skills: formData.skills,
        location: formData.location.trim() || undefined,
        availability: formData.availability,
        stats,
        social: Object.fromEntries(
          Object.entries(formData.social).filter(([_, value]) => value.trim() !== '')
        ),
        cardColor: cardColors[Math.floor(Math.random() * cardColors.length)]
      };

      await firebaseService.createEmployee(newEmployee);
      
      setSuccess(true);
      setTimeout(() => {
        onMemberAdded();
        handleClose();
      }, 1500);

    } catch (err) {
      console.error('Error adding member:', err);
      setError('Failed to add member. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Member Added Successfully!</h3>
            <p className="text-muted-foreground">
              {formData.name} has been added to the TOMO Academy team.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add New Team Member
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto max-h-[70vh] pr-2">
          {/* Basic Information */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="role">Role/Position *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g., Senior Developer"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="availability">Availability</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value: 'available' | 'busy' | 'offline') => 
                    setFormData(prev => ({ ...prev, availability: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="bio">Bio/Description</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Brief description about the team member"
                rows={3}
              />
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="name@tomoacademy.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Country"
                />
              </div>
            </div>
          </Card>

          {/* Skills */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Skills & Expertise
            </h3>
            
            <div className="flex gap-2 mb-3">
              <Input
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {formData.skills.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Add at least one skill (required)
              </p>
            )}
          </Card>

          {/* Social Links */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Social Links (Optional)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.social.linkedin}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    social: { ...prev.social, linkedin: e.target.value }
                  }))}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={formData.social.twitter}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    social: { ...prev.social, twitter: e.target.value }
                  }))}
                  placeholder="https://twitter.com/username"
                />
              </div>
              
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={formData.social.github}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    social: { ...prev.social, github: e.target.value }
                  }))}
                  placeholder="https://github.com/username"
                />
              </div>
              
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.social.website}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    social: { ...prev.social, website: e.target.value }
                  }))}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </Card>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Add Member
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}