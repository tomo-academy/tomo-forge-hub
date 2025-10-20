// src/components/Footer.tsx
import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Developed with</span>
          <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
          <span>by</span>
          <div className="relative">
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse hover:scale-110 transition-all duration-300 cursor-pointer block">
              AJ STUDIOZ
            </span>
            <span className="absolute inset-0 font-bold text-lg bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent opacity-0 animate-ping">
              AJ STUDIOZ
            </span>
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          © {new Date().getFullYear()} TOMO Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;