import { useState } from "react";
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
  Sparkles
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
  
  const ADMIN_EMAIL = 'tomoacademyofficial@gmail.com';
  
  const [loginData, setLoginData] = useState({
    password: ''
  });

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

    try {
      const success = await login(ADMIN_EMAIL, loginData.password);
      
      if (success) {
        setSuccess(true);
        setIsAnimating(true);
        setTimeout(() => {
          onLoginSuccess();
          handleClose();
          navigate('/admin');
        }, 1500);
      } else {
        setError('Invalid credentials. Only admin can login.');
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 500);
      }
    } catch (err: any) {
      setError('Login failed. Please try again.');
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg overflow-hidden p-0 bg-black border-0">
        <style jsx>{`
          :root {
            --border-color: #31302E;
            --shadow-color: #31302E;
            --main-bg-color: #000;
            --secondary-bg-color: #F8EEE2;
            --lamp-light-color: #E2D3C1;
            --lamp-dark-color: #E2D3C1;
            --rope-color: #EF4629;
            --icon-color: #31302E;
            --accent-color: #ff6b9d;
            --lamp-width: 120px;
            --lamp-height: 90px;
            --lamp-top-height: 18px;
          }

          .lamp-container {
            position: relative;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1.5rem;
            background: radial-gradient(ellipse at center, #0a0a0a 0%, #000 100%);
            min-height: 600px;
            overflow: hidden;
          }

          .lamp-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
              radial-gradient(circle at 20% 50%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(226, 211, 193, 0.05) 0%, transparent 50%);
            pointer-events: none;
          }

          .logo-section {
            position: relative;
            margin-bottom: 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 10;
          }

          .logo-glow {
            position: absolute;
            width: 120px;
            height: 120px;
            background: radial-gradient(circle, rgba(255, 107, 157, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            animation: pulse 3s ease-in-out infinite;
            filter: blur(20px);
          }

          .logo-wrapper {
            position: relative;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            overflow: hidden;
            box-shadow: 0 0 30px rgba(255, 107, 157, 0.3);
            transition: all 0.3s ease;
            animation: float 4s ease-in-out infinite;
          }

          .logo-wrapper:hover {
            transform: scale(1.05);
            box-shadow: 0 0 40px rgba(255, 107, 157, 0.5);
          }

          .logo-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .logo-sparkles {
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
          }

          .sparkle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
            animation: sparkle 2s linear infinite;
          }

          .sparkle:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
          .sparkle:nth-child(2) { top: 30%; right: 15%; animation-delay: 0.5s; }
          .sparkle:nth-child(3) { bottom: 25%; left: 20%; animation-delay: 1s; }
          .sparkle:nth-child(4) { bottom: 15%; right: 10%; animation-delay: 1.5s; }

          .slider-container {
            position: relative;
            width: 100%;
            max-width: 280px;
            margin: 0 auto 2rem;
            padding: 1.2rem 1.5rem;
            background: linear-gradient(135deg, rgba(248, 238, 226, 0.95) 0%, rgba(226, 211, 193, 0.95) 100%);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            z-index: 5;
          }

          .slider-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.8rem;
          }

          .slider-label {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--border-color);
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .light-indicator {
            display: flex;
            align-items: center;
            gap: 0.3rem;
          }

          .light-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--border-color);
            transition: all 0.3s ease;
          }

          .light-dot.active {
            background: var(--rope-color);
            box-shadow: 0 0 8px var(--rope-color);
          }

          .slider-track {
            position: relative;
            height: 6px;
            background: rgba(49, 48, 46, 0.2);
            border-radius: 3px;
            overflow: hidden;
          }

          .slider-fill {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            background: linear-gradient(90deg, var(--rope-color) 0%, #ffaa00 100%);
            border-radius: 3px;
            transition: width 0.3s ease;
            width: calc(var(--light-percent) * 1%);
          }

          input[type=range] {
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
            z-index: 2;
          }

          .lamp-wrapper {
            position: relative;
            width: 100%;
            display: flex;
            justify-content: center;
            margin-bottom: 2rem;
            z-index: 3;
          }

          .lamp {
            height: var(--lamp-height);
            width: var(--lamp-width);
            position: relative;
            z-index: 2;
            transition: transform 0.3s ease;
          }

          .lamp:hover {
            transform: scale(1.02);
          }

          .lamp-part {
            background-color: var(--lamp-dark-color);
            transform: skewX(-5deg);
            height: var(--lamp-height);
            width: 60%;
            position: absolute;
            top: 0;
            left: 0;
          }

          .lamp-part.-body.right {
            transform: skewX(5deg);
            left: auto;
            right: 0;
          }

          .lamp-part.-top {
            background: transparent;
            position: absolute;
            width: calc(var(--lamp-width) - 10px);
            height: var(--lamp-top-height);
            left: 6px;
            top: -17px;
          }

          .lamp-part.-top-part {
            width: 50%;
            height: var(--lamp-top-height);
            left: 0;
            top: 0;
            transform: skewX(-5deg);
            border-radius: 80% 0 0 0;
            border-top: 2px solid var(--border-color);
            border-bottom: none;
          }

          .lamp-part.-top-part.right {
            transform: skewX(5deg);
            left: auto;
            right: 1px;
            border-radius: 0 80% 0 0;
          }

          .lamp-part.-bottom {
            background: linear-gradient(#FFFFFA, #FDFFB2);
            height: calc(var(--lamp-top-height) + 10px);
            width: calc(var(--lamp-width) + 10px);
            position: absolute;
            top: auto;
            bottom: -18px;
            left: -5px;
            border-radius: 50%;
            border-top: 3px solid var(--border-color);
            border-bottom: 2px solid var(--border-color);
          }

          .lamp-part.-bottom:before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            background: linear-gradient(var(--border-color), var(--lamp-light-color));
            border-radius: 50%;
            width: 100%;
            height: 100%;
            opacity: 1;
          }

          .blub {
            position: absolute;
            width: calc(var(--lamp-width) - 20px);
            height: calc(var(--lamp-height) - 20px);
            top: calc(var(--lamp-top-height) - 10px);
            left: calc(var(--lamp-top-height) - 10px);
            border-radius: 5% 3% 38% 40%;
            background: radial-gradient(circle, #FFFFFA 0%, rgba(255, 255, 250, 0.8) 50%, transparent 70%);
            filter: blur(15px);
            z-index: 2;
            opacity: 0;
            transition: all 300ms ease;
          }

          .lamp-rope {
            position: absolute;
            width: 6px;
            height: 150px;
            background: linear-gradient(var(--border-color) 9%, var(--rope-color));
            bottom: 100%;
            margin: auto;
            border-radius: 3px;
          }

          .wall-light-shadow {
            background: radial-gradient(ellipse at center, var(--lamp-light-color) 0%, transparent 70%);
            width: 120%;
            height: 300px;
            position: absolute;
            top: 100%;
            left: -10%;
            border-radius: 50%;
            filter: blur(30px);
            z-index: 1;
            opacity: 0;
            transition: all 300ms ease;
          }

          .login-form {
            width: 100%;
            max-width: 320px;
            padding: 2rem;
            border-radius: 16px;
            background: linear-gradient(135deg, rgba(102, 51, 0, 0.95) 0%, rgba(80, 40, 0, 0.95) 100%);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            opacity: 0;
            transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateY(30px) scale(0.95);
            z-index: 4;
          }

          .login-form h2 {
            text-align: center;
            color: #E2D3C1;
            margin-bottom: 1.5rem;
            font-size: 1.5rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }

          .form-group {
            margin-bottom: 1.2rem;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #E2D3C1;
            font-weight: 500;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .form-group input {
            width: 100%;
            padding: 0.9rem;
            border: 1px solid rgba(226, 211, 193, 0.2);
            border-radius: 8px;
            font-size: 0.95rem;
            transition: all 300ms ease;
            box-sizing: border-box;
            background: rgba(226, 211, 193, 0.9);
            color: var(--border-color);
          }

          .form-group input:focus {
            outline: none;
            border-color: var(--rope-color);
            box-shadow: 0 0 0 3px rgba(239, 70, 41, 0.1);
            transform: translateY(-1px);
          }

          .form-group input:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .email-display {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.9rem;
            background: rgba(226, 211, 193, 0.2);
            border: 1px solid rgba(226, 211, 193, 0.3);
            border-radius: 8px;
            color: #E2D3C1;
            font-size: 0.9rem;
          }

          .password-input-wrapper {
            position: relative;
          }

          .password-toggle {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: var(--border-color);
            padding: 4px;
            border-radius: 4px;
            transition: all 200ms ease;
          }

          .password-toggle:hover {
            background: rgba(0, 0, 0, 0.1);
            color: var(--rope-color);
          }

          .login-btn {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #E2D3C1 0%, #d4c4b0 100%);
            color: #000;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 300ms ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            box-shadow: 0 4px 15px rgba(226, 211, 193, 0.3);
          }

          .login-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(226, 211, 193, 0.4);
            background: linear-gradient(135deg, #d4c4b0 0%, #c5b5a1 100%);
          }

          .login-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }

          .error-message {
            color: #ff6b6b;
            margin-top: 0.8rem;
            text-align: center;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.8rem;
            background: rgba(255, 107, 107, 0.1);
            border-radius: 6px;
            border: 1px solid rgba(255, 107, 107, 0.2);
            animation: shake 0.5s ease-in-out;
          }

          .success-message {
            color: #4ade80;
            margin-top: 0.8rem;
            text-align: center;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.8rem;
            background: rgba(74, 222, 128, 0.1);
            border-radius: 6px;
            border: 1px solid rgba(74, 222, 128, 0.2);
            animation: slideIn 0.5s ease-out;
          }

          .security-info {
            text-align: center;
            font-size: 0.75rem;
            color: rgba(226, 211, 193, 0.6);
            margin-top: 1.2rem;
            padding-top: 1.2rem;
            border-top: 1px solid rgba(226, 211, 193, 0.1);
          }

          .security-info p {
            margin: 0.2rem 0;
          }

          /* Light intensity states */
          [data-light^="1"] .blub, [data-light^="1"] .wall-light-shadow {
            opacity: 0.1;
          }
          [data-light^="1"] .lamp-part.-bottom:before {
            opacity: 0.9;
          }
          [data-light^="1"] .login-form {
            opacity: 0.1;
            transform: translateY(25px) scale(0.94);
          }

          [data-light^="2"] .blub, [data-light^="2"] .wall-light-shadow {
            opacity: 0.2;
          }
          [data-light^="2"] .lamp-part.-bottom:before {
            opacity: 0.8;
          }
          [data-light^="2"] .login-form {
            opacity: 0.2;
            transform: translateY(20px) scale(0.95);
          }

          [data-light^="3"] .blub, [data-light^="3"] .wall-light-shadow {
            opacity: 0.3;
          }
          [data-light^="3"] .lamp-part.-bottom:before {
            opacity: 0.7;
          }
          [data-light^="3"] .login-form {
            opacity: 0.3;
            transform: translateY(15px) scale(0.96);
          }

          [data-light^="4"] .blub, [data-light^="4"] .wall-light-shadow {
            opacity: 0.4;
          }
          [data-light^="4"] .lamp-part.-bottom:before {
            opacity: 0.6;
          }
          [data-light^="4"] .login-form {
            opacity: 0.4;
            transform: translateY(12px) scale(0.97);
          }

          [data-light^="5"] .blub, [data-light^="5"] .wall-light-shadow {
            opacity: 0.5;
          }
          [data-light^="5"] .lamp-part.-bottom:before {
            opacity: 0.5;
          }
          [data-light^="5"] .login-form {
            opacity: 0.5;
            transform: translateY(8px) scale(0.98);
          }

          [data-light^="6"] .blub, [data-light^="6"] .wall-light-shadow {
            opacity: 0.6;
          }
          [data-light^="6"] .lamp-part.-bottom:before {
            opacity: 0.4;
          }
          [data-light^="6"] .login-form {
            opacity: 0.6;
            transform: translateY(5px) scale(0.99);
          }

          [data-light^="7"] .blub, [data-light^="7"] .wall-light-shadow {
            opacity: 0.7;
          }
          [data-light^="7"] .lamp-part.-bottom:before {
            opacity: 0.3;
          }
          [data-light^="7"] .login-form {
            opacity: 0.7;
            transform: translateY(3px) scale(0.995);
          }

          [data-light^="8"] .blub, [data-light^="8"] .wall-light-shadow {
            opacity: 0.8;
          }
          [data-light^="8"] .lamp-part.-bottom:before {
            opacity: 0.2;
          }
          [data-light^="8"] .login-form {
            opacity: 0.8;
            transform: translateY(1px) scale(0.998);
          }

          [data-light^="9"] .blub, [data-light^="9"] .wall-light-shadow {
            opacity: 0.9;
          }
          [data-light^="9"] .lamp-part.-bottom:before {
            opacity: 0.1;
          }
          [data-light^="9"] .login-form {
            opacity: 0.9;
            transform: translateY(0) scale(0.999);
          }

          [data-light="10"] .blub, [data-light="10"] .wall-light-shadow {
            opacity: 1;
          }
          [data-light="10"] .lamp-part.-bottom:before {
            opacity: 0;
          }
          [data-light="10"] .login-form {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          /* Animations */
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.1); opacity: 0.5; }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          @keyframes sparkle {
            0% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0); }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }

          @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* Responsive Design */
          @media (max-width: 640px) {
            .lamp-container {
              padding: 1rem;
              min-height: 500px;
            }

            .logo-wrapper {
              width: 60px;
              height: 60px;
            }

            .logo-glow {
              width: 90px;
              height: 90px;
            }

            .slider-container {
              max-width: 240px;
              padding: 1rem 1.2rem;
            }

            :root {
              --lamp-width: 100px;
              --lamp-height: 75px;
              --lamp-top-height: 15px;
            }

            .lamp-rope {
              height: 120px;
            }

            .login-form {
              max-width: 280px;
              padding: 1.5rem;
            }

            .login-form h2 {
              font-size: 1.3rem;
            }
          }

          @media (max-width: 480px) {
            .lamp-container {
              padding: 0.8rem;
              min-height: 450px;
            }

            .logo-wrapper {
              width: 50px;
              height: 50px;
            }

            .slider-container {
              max-width: 220px;
              padding: 0.8rem 1rem;
            }

            :root {
              --lamp-width: 80px;
              --lamp-height: 60px;
              --lamp-top-height: 12px;
            }

            .lamp-rope {
              height: 100px;
            }

            .login-form {
              max-width: 260px;
              padding: 1.2rem;
            }

            .login-form h2 {
              font-size: 1.2rem;
            }

            .form-group input {
              padding: 0.8rem;
              font-size: 0.9rem;
            }

            .login-btn {
              padding: 0.9rem;
              font-size: 0.9rem;
            }
          }

          /* High DPI displays */
          @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .logo-wrapper img {
              image-rendering: -webkit-optimize-contrast;
              image-rendering: crisp-edges;
            }
          }

          /* Dark mode support */
          @media (prefers-color-scheme: dark) {
            .lamp-container {
              background: radial-gradient(ellipse at center, #050505 0%, #000 100%);
            }
          }

          /* Reduced motion */
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>

        <div className="lamp-container" data-light={lightIntensity} style={{ '--light-percent': lightIntensity * 10 }}>
          {/* Enhanced Logo Section */}
          <div className="logo-section">
            <div className="logo-glow"></div>
            <div className="logo-wrapper">
              <img 
                src="https://z-cdn-media.chatglm.cn/files/ce80a54c-58dd-4f82-8c5d-69e50d6c51f0_image_1760449128343.jpeg?auth_key=1792030520-95e760f38f634f2884fb3a8eb65301e1-0-9720878a0c9f8ae370172df43da29c24" 
                alt="Logo" 
              />
              <div className="logo-sparkles">
                <div className="sparkle"></div>
                <div className="sparkle"></div>
                <div className="sparkle"></div>
                <div className="sparkle"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Light Slider */}
          <div className="slider-container">
            <div className="slider-header">
              <div className="slider-label">
                <Sparkles className="w-4 h-4" />
                Light Intensity
              </div>
              <div className="light-indicator">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={cn("light-dot", i < Math.ceil(lightIntensity / 2) && "active")}
                  />
                ))}
              </div>
            </div>
            <div className="slider-track">
              <div className="slider-fill"></div>
              <input 
                type="range" 
                value={lightIntensity} 
                min="0" 
                max="10" 
                onChange={(e) => setLightIntensity(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Lamp */}
          <div className="lamp-wrapper">
            <div className="lamp-rope"></div>
            <div className="lamp">
              <div className="lamp-part -top">
                  <div className="lamp-part -top-part"></div>
                  <div className="lamp-part -top-part right"></div>
              </div>
              <div className="lamp-part -body"></div>
              <div className="lamp-part -body right"></div>
              <div className="lamp-part -bottom"></div>
              <div className="blub"></div>
            </div>
            <div className="wall-light-shadow"></div>
          </div>

          {/* Login Form */}
          <div className="login-form">
            <h2>
              <Shield className="w-5 h-5" />
              Admin Portal
            </h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <div className="email-display">
                  <Shield className="w-4 h-4" />
                  {ADMIN_EMAIL}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="password">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"}
                    id="password" 
                    name="password" 
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Enter admin password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="error-message">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              {success && (
                <div className="success-message">
                  <CheckCircle className="w-4 h-4" />
                  Login successful! Redirecting...
                </div>
              )}
              <button type="submit" className="login-btn" disabled={isLoading || success}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Login as Admin
                  </>
                )}
              </button>
            </form>
            <div className="security-info">
              <p>🔒 Secure admin-only access</p>
              <p>Contact system administrator for credentials</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
