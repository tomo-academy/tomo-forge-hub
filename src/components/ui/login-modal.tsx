import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle,
  Shield,
  Loader2,
  Sparkles,
  Zap,
  Crown,
  Fingerprint,
  Key,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lightIntensity, setLightIntensity] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const ADMIN_EMAIL = 'tomoacademyofficial@gmail.com';
  
  const [loginData, setLoginData] = useState({
    password: ''
  });

  // Generate particles for background effect
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setParticles(newParticles);
  }, []);

  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 10,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 10
        });
      }
    };

    if (isOpen) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isOpen]);

  const resetForm = () => {
    setLoginData({ password: '' });
    setError(null);
    setSuccess(false);
    setShowPassword(false);
    setLightIntensity(0);
    setIsAnimating(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsAnimating(true);

    try {
      const success = await login(ADMIN_EMAIL, loginData.password);
      
      if (success) {
        setSuccess(true);
        setLightIntensity(10);
        setTimeout(() => {
          onLoginSuccess();
          handleClose();
          navigate('/admin');
        }, 2000);
      } else {
        setError('Invalid credentials. Only admin can login.');
        setTimeout(() => setIsAnimating(false), 500);
      }
    } catch (err: any) {
      setError('Login failed. Please try again.');
      setTimeout(() => setIsAnimating(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg overflow-hidden p-0 bg-black border-0 shadow-2xl rounded-2xl">
        <style jsx>{`
          :root {
            --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            --accent-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            --glass-bg: rgba(255, 255, 255, 0.05);
            --glass-border: rgba(255, 255, 255, 0.1);
            --text-primary: #ffffff;
            --text-secondary: rgba(255, 255, 255, 0.7);
            --error-color: #ff4757;
            --success-color: #00d2d3;
            --lamp-glow: rgba(255, 223, 186, 0.8);
            --shadow-color: rgba(0, 0, 0, 0.3);
          }

          .modal-container {
            position: relative;
            width: 100%;
            height: 600px;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
            overflow: hidden;
          }

          .background-grid {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 30px 30px;
            animation: grid-move 20s linear infinite;
            opacity: 0.5;
          }

          .particles {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
          }

          .particle {
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            opacity: 0;
            animation: float-particle 8s infinite;
          }

          .close-button {
            position: absolute;
            top: 1rem;
            right: 1rem;
            z-index: 50;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            color: var(--text-secondary);
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .close-button:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
            transform: scale(1.05);
          }

          .content-wrapper {
            position: relative;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 2rem 1.5rem;
            z-index: 10;
          }

          .logo-section {
            position: relative;
            margin-bottom: 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .logo-orbital {
            position: relative;
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .orbital-ring {
            position: absolute;
            border: 1px solid rgba(102, 126, 234, 0.3);
            border-radius: 50%;
            animation: rotate 15s linear infinite;
          }

          .orbital-ring-1 {
            width: 100px;
            height: 100px;
          }

          .orbital-ring-2 {
            width: 120px;
            height: 120px;
            animation-duration: 20s;
            animation-direction: reverse;
            border-color: rgba(240, 147, 251, 0.2);
          }

          .logo-glow {
            position: absolute;
            width: 70px;
            height: 70px;
            background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%);
            border-radius: 50%;
            filter: blur(15px);
            animation: pulse-glow 3s ease-in-out infinite;
          }

          .logo-wrapper {
            position: relative;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            overflow: hidden;
            box-shadow: 
              0 0 30px rgba(102, 126, 234, 0.4),
              0 0 60px rgba(240, 147, 251, 0.2);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            animation: logo-float 6s ease-in-out infinite;
            border: 2px solid rgba(255, 255, 255, 0.1);
            z-index: 5;
          }

          .logo-wrapper:hover {
            transform: scale(1.05) rotate(5deg);
            box-shadow: 
              0 0 40px rgba(102, 126, 234, 0.6),
              0 0 80px rgba(240, 147, 251, 0.3);
          }

          .logo-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .energy-particles {
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
          }

          .energy-particle {
            position: absolute;
            width: 2px;
            height: 2px;
            background: linear-gradient(45deg, #667eea, #f093fb);
            border-radius: 50%;
            animation: energy-orbit 4s linear infinite;
          }

          .light-control {
            position: relative;
            width: 100%;
            max-width: 280px;
            margin: 0 auto 1.5rem;
            padding: 1rem 1.2rem;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 16px;
            box-shadow: 0 4px 20px var(--shadow-color);
          }

          .control-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.8rem;
          }

          .control-label {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            color: var(--text-primary);
            font-weight: 600;
            font-size: 0.85rem;
          }

          .intensity-display {
            display: flex;
            align-items: center;
            gap: 0.3rem;
            padding: 0.2rem 0.6rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: var(--text-primary);
            font-size: 0.75rem;
            font-weight: 500;
          }

          .slider-container {
            position: relative;
            height: 32px;
            display: flex;
            align-items: center;
          }

          .slider-track {
            position: relative;
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
          }

          .slider-fill {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            background: var(--accent-gradient);
            border-radius: 3px;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 15px rgba(79, 172, 254, 0.5);
          }

          .slider-thumb {
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 18px;
            height: 18px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            transition: all 0.2s ease;
            cursor: pointer;
          }

          .slider-thumb:hover {
            transform: translate(-50%, -50%) scale(1.2);
            box-shadow: 0 0 15px rgba(79, 172, 254, 0.8);
          }

          input[type=range] {
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
            z-index: 2;
          }

          .lamp-system {
            position: relative;
            width: 100%;
            display: flex;
            justify-content: center;
            margin-bottom: 1.5rem;
            transform-style: preserve-3d;
            perspective: 800px;
          }

          .lamp-container {
            position: relative;
            transform: rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg));
            transition: transform 0.1s ease-out;
          }

          .lamp-cable {
            position: absolute;
            width: 3px;
            height: 60px;
            background: linear-gradient(180deg, #333 0%, #666 100%);
            left: 50%;
            transform: translateX(-50%);
            bottom: 100%;
            border-radius: 2px;
          }

          .lamp-body {
            position: relative;
            width: 70px;
            height: 50px;
            background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            box-shadow: 
              0 8px 20px rgba(0, 0, 0, 0.3),
              inset 0 -3px 8px rgba(0, 0, 0, 0.2);
            overflow: hidden;
          }

          .lamp-bulb {
            position: absolute;
            width: 45px;
            height: 45px;
            background: radial-gradient(circle, #fff 0%, #ffd89b 50%, transparent 70%);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.5s ease;
            filter: blur(2px);
          }

          .light-rays {
            position: absolute;
            width: 150px;
            height: 150px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.5s ease;
          }

          .light-ray {
            position: absolute;
            width: 2px;
            height: 60px;
            background: linear-gradient(180deg, var(--lamp-glow) 0%, transparent 100%);
            top: 50%;
            left: 50%;
            transform-origin: center top;
            opacity: 0.6;
          }

          .auth-form {
            position: relative;
            width: 100%;
            max-width: 300px;
            padding: 1.5rem;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            box-shadow: 
              0 15px 40px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .form-header {
            text-align: center;
            margin-bottom: 1.5rem;
          }

          .form-title {
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 0.3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
          }

          .form-subtitle {
            color: var(--text-secondary);
            font-size: 0.8rem;
          }

          .form-group {
            margin-bottom: 1.2rem;
          }

          .form-label {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            color: var(--text-primary);
            font-weight: 500;
            font-size: 0.85rem;
            margin-bottom: 0.4rem;
          }

          .input-wrapper {
            position: relative;
          }

          .form-input {
            width: 100%;
            padding: 0.8rem 0.8rem 0.8rem 2.2rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            color: var(--text-primary);
            font-size: 0.9rem;
            transition: all 0.3s ease;
          }

          .form-input:focus {
            outline: none;
            border-color: #667eea;
            background: rgba(255, 255, 255, 0.08);
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }

          .input-icon {
            position: absolute;
            left: 0.7rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-secondary);
            pointer-events: none;
          }

          .password-toggle {
            position: absolute;
            right: 0.7rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 0.2rem;
            border-radius: 4px;
            transition: all 0.2s ease;
          }

          .password-toggle:hover {
            color: var(--text-primary);
            background: rgba(255, 255, 255, 0.1);
          }

          .email-display {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            padding: 0.8rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            color: var(--text-secondary);
            font-size: 0.85rem;
          }

          .submit-button {
            width: 100%;
            padding: 0.8rem;
            background: var(--primary-gradient);
            border: none;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          }

          .submit-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
          }

          .submit-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }

          .message {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            padding: 0.6rem;
            border-radius: 6px;
            font-size: 0.8rem;
            margin-top: 0.8rem;
            animation: slide-in 0.3s ease-out;
          }

          .error-message {
            background: rgba(255, 71, 87, 0.1);
            border: 1px solid rgba(255, 71, 87, 0.2);
            color: var(--error-color);
          }

          .success-message {
            background: rgba(0, 210, 211, 0.1);
            border: 1px solid rgba(0, 210, 211, 0.2);
            color: var(--success-color);
          }

          .security-footer {
            text-align: center;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .security-text {
            color: var(--text-secondary);
            font-size: 0.7rem;
            margin: 0.2rem 0;
          }

          /* Light intensity states */
          [data-light="0"] .auth-form {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          [data-light="0"] .lamp-bulb,
          [data-light="0"] .light-rays {
            opacity: 0;
          }

          [data-light="1"] .auth-form {
            opacity: 0.1;
            transform: translateY(18px) scale(0.96);
          }
          [data-light="1"] .lamp-bulb,
          [data-light="1"] .light-rays {
            opacity: 0.1;
          }

          [data-light="2"] .auth-form {
            opacity: 0.2;
            transform: translateY(16px) scale(0.97);
          }
          [data-light="2"] .lamp-bulb,
          [data-light="2"] .light-rays {
            opacity: 0.2;
          }

          [data-light="3"] .auth-form {
            opacity: 0.3;
            transform: translateY(14px) scale(0.98);
          }
          [data-light="3"] .lamp-bulb,
          [data-light="3"] .light-rays {
            opacity: 0.3;
          }

          [data-light="4"] .auth-form {
            opacity: 0.4;
            transform: translateY(12px) scale(0.985);
          }
          [data-light="4"] .lamp-bulb,
          [data-light="4"] .light-rays {
            opacity: 0.4;
          }

          [data-light="5"] .auth-form {
            opacity: 0.5;
            transform: translateY(10px) scale(0.99);
          }
          [data-light="5"] .lamp-bulb,
          [data-light="5"] .light-rays {
            opacity: 0.5;
          }

          [data-light="6"] .auth-form {
            opacity: 0.6;
            transform: translateY(8px) scale(0.995);
          }
          [data-light="6"] .lamp-bulb,
          [data-light="6"] .light-rays {
            opacity: 0.6;
          }

          [data-light="7"] .auth-form {
            opacity: 0.7;
            transform: translateY(6px) scale(0.998);
          }
          [data-light="7"] .lamp-bulb,
          [data-light="7"] .light-rays {
            opacity: 0.7;
          }

          [data-light="8"] .auth-form {
            opacity: 0.8;
            transform: translateY(4px) scale(0.999);
          }
          [data-light="8"] .lamp-bulb,
          [data-light="8"] .light-rays {
            opacity: 0.8;
          }

          [data-light="9"] .auth-form {
            opacity: 0.9;
            transform: translateY(2px) scale(1);
          }
          [data-light="9"] .lamp-bulb,
          [data-light="9"] .light-rays {
            opacity: 0.9;
          }

          [data-light="10"] .auth-form {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          [data-light="10"] .lamp-bulb,
          [data-light="10"] .light-rays {
            opacity: 1;
          }

          /* Animations */
          @keyframes grid-move {
            0% { transform: translate(0, 0); }
            100% { transform: translate(30px, 30px); }
          }

          @keyframes float-particle {
            0% { 
              opacity: 0;
              transform: translateY(0) scale(0);
            }
            10% {
              opacity: 1;
              transform: translateY(-5px) scale(1);
            }
            90% {
              opacity: 1;
              transform: translateY(-50px) scale(1);
            }
            100% { 
              opacity: 0;
              transform: translateY(-60px) scale(0);
            }
          }

          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes pulse-glow {
            0%, 100% { 
              transform: scale(1);
              opacity: 0.4;
            }
            50% { 
              transform: scale(1.1);
              opacity: 0.6;
            }
          }

          @keyframes logo-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }

          @keyframes energy-orbit {
            from { 
              transform: rotate(0deg) translateX(35px) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            to { 
              transform: rotate(360deg) translateX(35px) rotate(-360deg);
              opacity: 0;
            }
          }

          @keyframes slide-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Responsive Design */
          @media (max-width: 640px) {
            .modal-container {
              height: 500px;
              max-height: 85vh;
            }

            .content-wrapper {
              padding: 1.5rem 1rem;
            }

            .logo-orbital {
              width: 70px;
              height: 70px;
            }

            .orbital-ring-1 {
              width: 90px;
              height: 90px;
            }

            .orbital-ring-2 {
              width: 110px;
              height: 110px;
            }

            .logo-wrapper {
              width: 50px;
              height: 50px;
            }

            .light-control {
              max-width: 250px;
              padding: 0.8rem 1rem;
            }

            .lamp-body {
              width: 60px;
              height: 43px;
            }

            .lamp-cable {
              height: 50px;
            }

            .auth-form {
              max-width: 280px;
              padding: 1.2rem;
            }

            .form-title {
              font-size: 1.1rem;
            }
          }

          @media (max-width: 480px) {
            .modal-container {
              height: 450px;
              max-height: 80vh;
            }

            .content-wrapper {
              padding: 1rem 0.8rem;
            }

            .logo-orbital {
              width: 60px;
              height: 60px;
            }

            .orbital-ring-1 {
              width: 80px;
              height: 80px;
            }

            .orbital-ring-2 {
              width: 100px;
              height: 100px;
            }

            .logo-wrapper {
              width: 40px;
              height: 40px;
            }

            .light-control {
              max-width: 220px;
              padding: 0.6rem 0.8rem;
            }

            .lamp-body {
              width: 50px;
              height: 36px;
            }

            .lamp-cable {
              height: 40px;
            }

            .auth-form {
              max-width: 260px;
              padding: 1rem;
            }

            .form-title {
              font-size: 1rem;
            }

            .form-input {
              padding: 0.7rem 0.7rem 0.7rem 2rem;
              font-size: 0.85rem;
            }

            .submit-button {
              padding: 0.7rem;
              font-size: 0.85rem;
            }
          }

          /* High DPI and accessibility */
          @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .logo-wrapper img {
              image-rendering: -webkit-optimize-contrast;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>

        <div className="modal-container" ref={containerRef} data-light={lightIntensity}>
          {/* Close Button */}
          <button className="close-button" onClick={handleClose}>
            <X className="w-4 h-4" />
          </button>

          {/* Background Effects */}
          <div className="background-grid"></div>
          <div className="particles">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="particle"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  animationDelay: `${particle.id * 0.5}s`
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="content-wrapper">
            {/* Logo Section with Orbital Effects */}
            <div className="logo-section">
              <div className="logo-orbital">
                <div className="orbital-ring orbital-ring-1"></div>
                <div className="orbital-ring orbital-ring-2"></div>
                <div className="logo-glow"></div>
                <div className="logo-wrapper">
                  <img 
                    src="https://z-cdn-media.chatglm.cn/files/ce80a54c-58dd-4f82-8c5d-69e50d6c51f0_image_1760449128343.jpeg?auth_key=1792030520-95e760f38f634f2884fb3a8eb65301e1-0-9720878a0c9f8ae370172df43da29c24" 
                    alt="Logo" 
                  />
                  <div className="energy-particles">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="energy-particle"
                        style={{
                          animationDelay: `${i * 1}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Light Control Panel */}
            <div className="light-control">
              <div className="control-header">
                <div className="control-label">
                  <Zap className="w-3 h-3" />
                  Light Intensity
                </div>
                <div className="intensity-display">
                  <Sparkles className="w-3 h-3" />
                  {lightIntensity}/10
                </div>
              </div>
              <div className="slider-container">
                <div className="slider-track">
                  <div 
                    className="slider-fill" 
                    style={{ width: `${lightIntensity * 10}%` }}
                  />
                  <div 
                    className="slider-thumb" 
                    style={{ left: `${lightIntensity * 10}%` }}
                  />
                </div>
                <input 
                  type="range" 
                  value={lightIntensity} 
                  min="0" 
                  max="10" 
                  onChange={(e) => setLightIntensity(Number(e.target.value))}
                />
              </div>
            </div>

            {/* 3D Lamp System */}
            <div className="lamp-system">
              <div 
                className="lamp-container"
                style={{
                  '--rotate-x': `${-mousePosition.y}deg`,
                  '--rotate-y': `${mousePosition.x}deg`
                } as React.CSSProperties}
              >
                <div className="lamp-cable"></div>
                <div className="lamp-body">
                  <div className="lamp-bulb"></div>
                  <div className="light-rays">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="light-ray"
                        style={{
                          transform: `rotate(${i * 45}deg)`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Authentication Form */}
            <div className="auth-form">
              <div className="form-header">
                <h2 className="form-title">
                  <Crown className="w-4 h-4" />
                  Admin Portal
                </h2>
                <p className="form-subtitle">Secure access to system</p>
              </div>

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">
                    <Mail className="w-3 h-3" />
                    Email Address
                  </label>
                  <div className="email-display">
                    <Shield className="w-3 h-3" />
                    {ADMIN_EMAIL}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Key className="w-3 h-3" />
                    Password
                  </label>
                  <div className="input-wrapper">
                    <Lock className="input-icon w-3 h-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-input"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="message error-message">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </div>
                )}

                {success && (
                  <div className="message success-message">
                    <CheckCircle className="w-3 h-3" />
                    Login successful! Redirecting...
                  </div>
                )}

                <button type="submit" className="submit-button" disabled={isLoading || success}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-3 h-3" />
                      Login as Admin
                    </>
                  )}
                </button>
              </form>

              <div className="security-footer">
                <p className="security-text">🔒 End-to-end encrypted</p>
                <p className="security-text">Contact admin for credentials</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
