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
          <div className="relative group cursor-pointer">
            {/* Main text with gradient and glow effect */}
            <span className="relative font-bold text-xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse hover:scale-110 transition-all duration-300 drop-shadow-lg">
              AJ STUDIOZ
            </span>
            
            {/* Blinking overlay with different colors */}
            <span className="absolute inset-0 font-bold text-xl bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent opacity-0 animate-ping">
              AJ STUDIOZ
            </span>
            
            {/* Second blinking layer for more intensity */}
            <span className="absolute inset-0 font-bold text-xl bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 animate-bounce">
              AJ STUDIOZ
            </span>
            
            {/* Sparkle effect */}
            <span className="absolute inset-0 font-bold text-xl bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent opacity-0 animate-pulse group-hover:animate-ping">
              ✨ AJ STUDIOZ ✨
            </span>
            
            {/* Glow border effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg blur opacity-20 group-hover:opacity-40 animate-pulse"></div>
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