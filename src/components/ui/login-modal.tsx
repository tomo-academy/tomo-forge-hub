import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  Loader2
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
        setTimeout(() => {
          onLoginSuccess();
          handleClose();
          // Redirect to admin dashboard
          navigate('/admin');
        }, 1500);
      } else {
        setError('Invalid credentials. Only admin can login.');
      }
    } catch (err: any) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md overflow-hidden p-0 bg-black">
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
            --lamp-width: 140px;
            --lamp-height: 100px;
            --lamp-top-height: 20px;
          }

          .lamp-container {
            position: relative;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1.5rem 1.5rem 2rem;
            background: #000;
            min-height: 500px;
          }

          .slider-form {
            margin: 0 0 1em 0;
            width: 200px;
            padding: 1.5em 2.2em;
            border-radius: 4px;
            background: var(--secondary-bg-color);
            box-shadow: 0 5px 15px var(--shadow-color);
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .lamp-wrapper {
            position: relative;
            width: 100%;
            justify-content: center;
            display: flex;
            margin-bottom: 2em;
          }

          .lamp {
            height: var(--lamp-height);
            width: var(--lamp-width);
            position: relative;
            z-index: 2;
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
            background-color: #FFFFFA;
            filter: blur(15px);
            z-index: 2;
            opacity: 0;
            transition: all 300ms;
          }

          .lamp-rope {
            position: absolute;
            width: 8px;
            height: 200px;
            background: linear-gradient(var(--border-color) 9%, var(--rope-color));
            bottom: 100%;
            margin: auto;
          }

          .wall-light-shadow {
            background: linear-gradient(var(--lamp-light-color), var(--main-bg-color) 30%);
            width: 80%;
            height: 200vh;
            position: absolute;
            top: 150%;
            left: auto;
            border-radius: 50% 50% 0 0;
            filter: blur(5px);
            z-index: -1;
            opacity: 0;
            transition: all 300ms;
          }

          .login-form {
            margin-top: 20px;
            width: 250px;
            padding: 2em 2.2em;
            border-radius: 8px;
            background: #663300;
            box-shadow: 0 5px 15px var(--shadow-color);
            opacity: 0;
            transition: all 300ms ease;
            transform: translateY(20px);
          }

          .login-form h2 {
            text-align: center;
            color: #E2D3C1;
            margin-bottom: 1.5em;
            font-size: 1.5em;
          }

          .form-group {
            margin-bottom: 1.2em;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.5em;
            color: #E2D3C1;
            font-weight: bold;
            font-size: 0.9em;
          }

          .form-group input {
            width: 100%;
            padding: 0.8em;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            font-size: 1em;
            transition: border-color 300ms ease;
            box-sizing: border-box;
            background:#E2D3C1;
          }

          .form-group input:focus {
            outline: none;
            border-color: var(--rope-color);
          }

          .login-btn {
            width: 100%;
            padding: 0.8em;
            background: #E2D3C1;
            color: #000;
            border: none;
            border-radius: 4px;
            font-size: 1em;
            font-weight: bold;
            cursor: pointer;
            transition: all 300ms ease;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .login-btn:hover {
            color:#E2D3C1;
            background: #be5f00;
            transform: translateY(-1px);
          }

          .icon {
            width: 8px;
            height: 8px;
            display: inline-block;
          }

          .sun {
            background: var(--icon-color);
            border-radius: 50%;
            position: relative;
            float: left;
            transform: scale(0.8);
          }

          .ray {
            background: var(--icon-color);
            width: 2px;
            height: 4px;
            position: absolute;
            left: 3px;
            bottom: 12px;
            transform-origin: 50% calc(100% + 8px);
            border-radius: 50%;
          }

          .ray:nth-child(1) { transform: rotate(45deg); }
          .ray:nth-child(2) { transform: rotate(90deg); }
          .ray:nth-child(3) { transform: rotate(135deg); }
          .ray:nth-child(4) { transform: rotate(180deg); }
          .ray:nth-child(5) { transform: rotate(225deg); }
          .ray:nth-child(6) { transform: rotate(270deg); }
          .ray:nth-child(7) { transform: rotate(315deg); }
          .ray:nth-child(8) { transform: rotate(360deg); }

          input[type=range] {
            -webkit-appearance: none;
            width: calc(100% - 30px);
            float: right;
          }

          input[type=range]:focus {
            outline: none;
          }

          input[type=range]::-webkit-slider-runnable-track {
            width: 100%;
            height: 2px;
            cursor: pointer;
            background: var(--icon-color);
          }

          input[type=range]::-webkit-slider-thumb {
            height: 13px;
            width: 13px;
            border-radius: 50%;
            background: var(--icon-color);
            cursor: pointer;
            -webkit-appearance: none;
            margin-top: -6px;
          }

          input[type=range]:hover::-webkit-slider-thumb {
            box-shadow: 0 0 5px var(--icon-color);
          }

          input[type=range]::-moz-range-track {
            width: 100%;
            height: 2px;
            cursor: pointer;
            background: var(--icon-color);
          }

          input[type=range]::-moz-range-thumb {
            height: 13px;
            width: 13px;
            border-radius: 50%;
            background: var(--icon-color);
            cursor: pointer;
            -webkit-appearance: none;
            margin-top: -6px;
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
            transform: translateY(15px);
          }

          [data-light^="2"] .blub, [data-light^="2"] .wall-light-shadow {
            opacity: 0.2;
          }
          [data-light^="2"] .lamp-part.-bottom:before {
            opacity: 0.8;
          }
          [data-light^="2"] .login-form {
            opacity: 0.2;
            transform: translateY(10px);
          }

          [data-light^="3"] .blub, [data-light^="3"] .wall-light-shadow {
            opacity: 0.3;
          }
          [data-light^="3"] .lamp-part.-bottom:before {
            opacity: 0.7;
          }
          [data-light^="3"] .login-form {
            opacity: 0.3;
            transform: translateY(8px);
          }

          [data-light^="4"] .blub, [data-light^="4"] .wall-light-shadow {
            opacity: 0.4;
          }
          [data-light^="4"] .lamp-part.-bottom:before {
            opacity: 0.6;
          }
          [data-light^="4"] .login-form {
            opacity: 0.4;
            transform: translateY(6px);
          }

          [data-light^="5"] .blub, [data-light^="5"] .wall-light-shadow {
            opacity: 0.5;
          }
          [data-light^="5"] .lamp-part.-bottom:before {
            opacity: 0.5;
          }
          [data-light^="5"] .login-form {
            opacity: 0.5;
            transform: translateY(4px);
          }

          [data-light^="6"] .blub, [data-light^="6"] .wall-light-shadow {
            opacity: 0.6;
          }
          [data-light^="6"] .lamp-part.-bottom:before {
            opacity: 0.4;
          }
          [data-light^="6"] .login-form {
            opacity: 0.6;
            transform: translateY(3px);
          }

          [data-light^="7"] .blub, [data-light^="7"] .wall-light-shadow {
            opacity: 0.7;
          }
          [data-light^="7"] .lamp-part.-bottom:before {
            opacity: 0.3;
          }
          [data-light^="7"] .login-form {
            opacity: 0.7;
            transform: translateY(2px);
          }

          [data-light^="8"] .blub, [data-light^="8"] .wall-light-shadow {
            opacity: 0.8;
          }
          [data-light^="8"] .lamp-part.-bottom:before {
            opacity: 0.2;
          }
          [data-light^="8"] .login-form {
            opacity: 0.8;
            transform: translateY(1px);
          }

          [data-light^="9"] .blub, [data-light^="9"] .wall-light-shadow {
            opacity: 0.9;
          }
          [data-light^="9"] .lamp-part.-bottom:before {
            opacity: 0.1;
          }
          [data-light^="9"] .login-form {
            opacity: 0.9;
            transform: translateY(0);
          }

          [data-light="10"] .blub, [data-light="10"] .wall-light-shadow {
            opacity: 1;
          }
          [data-light="10"] .lamp-part.-bottom:before {
            opacity: 0;
          }
          [data-light="10"] .login-form {
            opacity: 1;
            transform: translateY(0);
          }

          .error-message {
            color: #ff6b6b;
            margin-top: 10px;
            text-align: center;
            font-size: 0.9em;
          }

          .success-message {
            color: #4ade80;
            margin-top: 10px;
            text-align: center;
            font-size: 0.9em;
          }

          .logo-container {
            margin-bottom: 1rem;
            display: flex;
            justify-content: center;
          }

          .password-toggle {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #31302E;
          }
        `}</style>

        <div className="lamp-container" data-light={lightIntensity}>
          {/* Logo - spherical pink and white pattern */}
          <div className="logo-container">
            <img 
              src="https://z-cdn-media.chatglm.cn/files/ce80a54c-58dd-4f82-8c5d-69e50d6c51f0_image_1760449128343.jpeg?auth_key=1792030520-95e760f38f634f2884fb3a8eb65301e1-0-9720878a0c9f8ae370172df43da29c24" 
              alt="Logo" 
              className="w-20 h-20 rounded-full"
            />
          </div>

          {/* Slider form above lamp */}
          <div className="slider-form">
            <div className="icon sun">
              <div className="ray"></div>
              <div className="ray"></div>
              <div className="ray"></div>
              <div className="ray"></div>
              <div className="ray"></div>
              <div className="ray"></div>
              <div className="ray"></div>
              <div className="ray"></div>
            </div>
            <input 
              type="range" 
              value={lightIntensity} 
              min="0" 
              max="10" 
              onChange={(e) => setLightIntensity(e.target.value)}
            />
          </div>

          {/* Lamp in the center */}
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

          {/* Login form below lamp */}
          <div className="login-form">
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">{ADMIN_EMAIL}</span>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    id="password" 
                    name="password" 
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
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
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">Login successful! Redirecting...</div>}
              <button type="submit" className="login-btn" disabled={isLoading || success}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 inline mr-2" />
                    Login as Admin
                  </>
                )}
              </button>
            </form>
            <div className="text-center text-xs text-muted-foreground pt-2">
              <p>🔒 Secure admin-only access</p>
              <p className="mt-1">Contact system administrator for credentials</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
