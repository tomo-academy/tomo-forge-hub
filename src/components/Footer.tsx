// src/components/Footer.tsx
import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Developed with</span>
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          <span>by</span>
          <span className="font-semibold text-foreground">AJ STUDIOZ</span>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          © {new Date().getFullYear()} TOMO Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;