import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, 
  Eye, 
  Edit, 
  Download, 
  Share2, 
  Copy, 
  Mail, 
  Phone,
  ExternalLink,
  UserX,
  Archive
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  employeeId: string;
  [key: string]: any;
}

interface EmployeeMenuProps {
  employee: Employee;
  onViewDetails: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

export function EmployeeMenu({ 
  employee, 
  onViewDetails, 
  onEdit, 
  onDelete, 
  onDownload, 
  onShare 
}: EmployeeMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(employee.email);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
    setIsOpen(false);
  };

  const copyPhone = async () => {
    if (employee.phone) {
      try {
        await navigator.clipboard.writeText(employee.phone);
        // You could add a toast notification here
      } catch (err) {
        console.error('Failed to copy phone:', err);
      }
    }
    setIsOpen(false);
  };

  const sendEmail = () => {
    window.location.href = `mailto:${employee.email}?subject=Hello ${employee.name}`;
    setIsOpen(false);
  };

  const callPhone = () => {
    if (employee.phone) {
      window.location.href = `tel:${employee.phone}`;
    }
    setIsOpen(false);
  };

  const viewProfile = () => {
    // Use internal routing to employee profile page
    window.open(`/profile/${employee.id}`, '_blank');
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onViewDetails}>
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={viewProfile}>
          <ExternalLink className="w-4 h-4 mr-2" />
          View Profile
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={sendEmail}>
          <Mail className="w-4 h-4 mr-2" />
          Send Email
        </DropdownMenuItem>
        
        {employee.phone && (
          <DropdownMenuItem onClick={callPhone}>
            <Phone className="w-4 h-4 mr-2" />
            Call Phone
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={copyEmail}>
          <Copy className="w-4 h-4 mr-2" />
          Copy Email
        </DropdownMenuItem>
        
        {employee.phone && (
          <DropdownMenuItem onClick={copyPhone}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Phone
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        {onDownload && (
          <DropdownMenuItem onClick={onDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download vCard
          </DropdownMenuItem>
        )}
        
        {onShare && (
          <DropdownMenuItem onClick={onShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Profile
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </DropdownMenuItem>
        )}
        
        {onDelete && (
          <DropdownMenuItem 
            onClick={onDelete}
            className="text-destructive focus:text-destructive"
          >
            <Archive className="w-4 h-4 mr-2" />
            Archive Member
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}