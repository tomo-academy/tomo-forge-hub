import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/db";
import { Loader2, UserPlus, Sparkles, Upload, Camera, X } from "lucide-react";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmployeeAdded?: (employee: any) => void;
}

export function AddEmployeeModal({ isOpen, onClose, onEmployeeAdded }: AddEmployeeModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "Technology",
    email: "",
    phone: "",
    location: "",
    bio: "",
    availability: "available" as 'available' | 'busy' | 'offline',
    skills: "" // comma-separated skills
  });
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.role || !formData.email) {
      toast({
        title: "❌ Missing Required Fields",
        description: "Please fill in name, role, and email",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate employee ID
      const employeeId = `TOMO-${String(Date.now()).slice(-4)}`;
      
      // Handle photo upload (in real app, upload to storage service)
      let avatarUrl = '/placeholder.jpg';
      if (photoPreview) {
        // In production, upload to cloud storage and get URL
        // For now, use the preview as base64 or placeholder
        avatarUrl = photoPreview;
      }

      // Parse skills
      const skillsArray = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      // Create employee object
      const newEmployee = {
        name: formData.name,
        role: formData.role,
        department: formData.department,
        email: formData.email,
        phone: formData.phone || undefined,
        employee_id: employeeId,
        join_date: new Date().toISOString().split('T')[0],
        avatar_url: avatarUrl,
        location: formData.location || undefined,
        availability: formData.availability,
        bio: formData.bio || undefined,
        skills: skillsArray,
        social_links: {},
        stats: {
          videos: 0,
          tasks: 0,
          rating: 5.0,
          projects: 0
        },
        card_color: 'primary'
      };

      // Save to database
      const savedEmployee = await db.employees.create(newEmployee);

      if (savedEmployee) {
        toast({
          title: "✅ Employee Added Successfully!",
          description: `${formData.name} has been added to the team.`,
          duration: 3000,
        });

        // Notify parent
        if (onEmployeeAdded) {
          onEmployeeAdded({
            ...savedEmployee,
            employeeId: savedEmployee.employee_id,
            joinDate: savedEmployee.join_date,
            id: savedEmployee.id
          });
        }

        // Reset form
        setFormData({
          name: "",
          role: "",
          department: "Technology",
          email: "",
          phone: "",
          location: "",
          bio: "",
          availability: "available",
          skills: ""
        });
        setPhotoFile(null);
        setPhotoPreview(null);

        // Close modal
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        throw new Error("Failed to save employee");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      toast({
        title: "❌ Failed to Add Employee",
        description: "Please try again or check your database connection.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Add New Team Member
          </DialogTitle>
          <DialogDescription>
            Add a new employee to the TOMO Academy team
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Photo Upload Section */}
          <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-lg bg-muted/20">
            <div className="relative">
              {photoPreview ? (
                <div className="relative group">
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border-4 border-white shadow-lg">
                  <Camera className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
            <div className="text-center">
              <Label htmlFor="photo-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  <Upload className="w-4 h-4" />
                  {photoPreview ? 'Change Photo' : 'Upload Photo'}
                </div>
              </Label>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-2">
                JPG, PNG or GIF (Max 5MB)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isSubmitting}
                required
                className="mt-2"
              />
            </div>

            {/* Role */}
            <div>
              <Label htmlFor="role">Role / Position *</Label>
              <Input
                id="role"
                placeholder="Senior Developer"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                disabled={isSubmitting}
                required
                className="mt-2"
              />
            </div>

            {/* Department */}
            <div>
              <Label htmlFor="department">Department *</Label>
              <Select 
                value={formData.department} 
                onValueChange={(value) => setFormData({ ...formData, department: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Content Production">Content Production</SelectItem>
                  <SelectItem value="Content Strategy">Content Strategy</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@tomoacademy.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isSubmitting}
                required
                className="mt-2"
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={isSubmitting}
                className="mt-2"
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Chennai, India"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={isSubmitting}
                className="mt-2"
              />
            </div>

            {/* Availability */}
            <div>
              <Label htmlFor="availability">Availability Status</Label>
              <Select 
                value={formData.availability} 
                onValueChange={(value: any) => setFormData({ ...formData, availability: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Skills */}
            <div className="md:col-span-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                placeholder="React, TypeScript, Node.js, Video Editing"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                disabled={isSubmitting}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate skills with commas
              </p>
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <Label htmlFor="bio">Bio / Description</Label>
              <Textarea
                id="bio"
                placeholder="Brief description about the employee..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                disabled={isSubmitting}
                className="mt-2"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              <span>Saved to Neon Database</span>
            </div>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Add Employee
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
