import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, Globe, Volume2, VolumeX, Palette, Settings } from 'lucide-react';

interface HackerClockProps {
  className?: string;
}

const HackerClock: React.FC<HackerClockProps> = ({ className = '' }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(0);
  const [showExpanded, setShowExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('');
  const [userTimezone, setUserTimezone] = useState<string>('');
  const [ispDetails, setIspDetails] = useState<{ip: string, isp: string} | null>(null);

  const hourHandRef = useRef<HTMLDivElement>(null);
  const minuteHandRef = useRef<HTMLDivElement>(null);
  const secondHandRef = useRef<HTMLDivElement>(null);

  const themes = [
    { primary: '#00ff41', secondary: '#00d4ff' },
    { primary: '#ff0080', secondary: '#00ff88' },
    { primary: '#00d4ff', secondary: '#ff00ff' },
    { primary: '#ffff00', secondary: '#ff0080' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const updateAnalogClock = useCallback(() => {
    const now = currentTime;
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const hourAngle = (hours * 30) + (minutes * 0.5);
    const minuteAngle = minutes * 6;
    const secondAngle = seconds * 6;
    
    if (hourHandRef.current) {
      hourHandRef.current.style.transform = `translate(-50%, -100%) rotate(${hourAngle}deg)`;
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.style.transform = `translate(-50%, -100%) rotate(${minuteAngle}deg)`;
    }
    if (secondHandRef.current) {
      secondHandRef.current.style.transform = `translate(-50%, -100%) rotate(${secondAngle}deg)`;
    }
  }, [currentTime]);

  useEffect(() => {
    updateAnalogClock();
    if (soundEnabled && currentTime.getSeconds() % 5 === 0) {
      playTickSound();
    }
  }, [currentTime, soundEnabled, updateAnalogClock]);

  const formatTime = (date: Date, use24Hour = is24Hour) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    if (!use24Hour) {
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${period}`;
    }
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options).toUpperCase();
  };

  const formatTimeOnly = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const getTimeZoneTime = (timezone: string) => {
    try {
      const date = new Date(currentTime.toLocaleString("en-US", { timeZone: timezone }));
      return formatTimeOnly(date);
    } catch {
      return '--:--:--';
    }
  };

  const playTickSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Silently handle audio context errors
    }
  };

  const detectLocationAndISP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data) {
        const location = `${data.city}, ${data.region} ${data.country_name}`.trim();
        setUserLocation(location);
        setUserTimezone(data.timezone);
        setIspDetails({
          ip: data.ip,
          isp: data.org
        });
      }
    } catch (error) {
      console.error("Error fetching IP info:", error);
      setUserLocation("UNKNOWN");
      setIspDetails({ ip: "UNKNOWN", isp: "UNKNOWN" });
    }
  };

  const handleThemeChange = () => {
    const newTheme = (currentTheme + 1) % themes.length;
    setCurrentTheme(newTheme);
    const theme = themes[newTheme];
    
    // Apply theme to CSS variables
    document.documentElement.style.setProperty('--hacker-primary', theme.primary);
    document.documentElement.style.setProperty('--hacker-secondary', theme.secondary);
  };

  const handleExpandedView = () => {
    setShowExpanded(!showExpanded);
    if (!userLocation && !showExpanded) {
      detectLocationAndISP();
    }
  };

  const timeZones = [
    { name: userLocation || 'LOCAL', timezone: userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone, time: formatTimeOnly(currentTime) },
    { name: 'LONDON', timezone: 'Europe/London', time: getTimeZoneTime('Europe/London') },
    { name: 'NEW YORK', timezone: 'America/New_York', time: getTimeZoneTime('America/New_York') },
    { name: 'TOKYO', timezone: 'Asia/Tokyo', time: getTimeZoneTime('Asia/Tokyo') },
    { name: 'INDIA', timezone: 'Asia/Kolkata', time: getTimeZoneTime('Asia/Kolkata') },
    { name: 'ALASKA', timezone: 'America/Anchorage', time: getTimeZoneTime('America/Anchorage') },
    { name: 'SYDNEY', timezone: 'Australia/Sydney', time: getTimeZoneTime('Australia/Sydney') },
    { name: 'DUBAI', timezone: 'Asia/Dubai', time: getTimeZoneTime('Asia/Dubai') }
  ];

  return (
    <>
      <style jsx>{`
        :root {
          --hacker-primary: ${themes[currentTheme].primary};
          --hacker-secondary: ${themes[currentTheme].secondary};
          --hacker-glow: 0 0 10px;
        }
        
        .hacker-clock-widget {
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid var(--hacker-primary);
          border-radius: 8px;
          padding: 12px 18px;
          box-shadow: var(--hacker-glow) var(--hacker-primary);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 15px;
          font-family: 'Courier New', monospace;
        }
        
        .hacker-clock-widget::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, var(--hacker-primary), var(--hacker-secondary));
          opacity: 0.1;
          z-index: -1;
        }
        
        .hacker-clock-widget:hover {
          transform: translateY(-2px);
          box-shadow: var(--hacker-glow) var(--hacker-primary);
        }
        
        .analog-clock {
          width: 60px;
          height: 60px;
          position: relative;
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid var(--hacker-primary);
          border-radius: 50%;
          box-shadow: var(--hacker-glow) var(--hacker-primary);
        }
        
        .analog-clock::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 4px;
          background: var(--hacker-primary);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
        }
        
        .clock-face {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        
        .hand {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: 50% 100%;
          border-radius: 2px;
        }
        
        .hour-hand {
          width: 3px;
          height: 20px;
          background: var(--hacker-primary);
          box-shadow: var(--hacker-glow) var(--hacker-primary);
        }
        
        .minute-hand {
          width: 2px;
          height: 28px;
          background: var(--hacker-secondary);
          box-shadow: var(--hacker-glow) var(--hacker-secondary);
        }
        
        .second-hand {
          width: 1px;
          height: 30px;
          background: #ff0080;
          box-shadow: var(--hacker-glow) #ff0080;
        }
        
        .clock-marker {
          position: absolute;
          width: 2px;
          height: 4px;
          background: var(--hacker-primary);
          left: 50%;
          transform: translateX(-50%);
          opacity: 0.7;
        }
        
        .clock-marker:nth-child(1) { top: 2px; }
        .clock-marker:nth-child(2) { top: 50%; right: 2px; left: auto; transform: translateY(-50%); width: 4px; height: 2px; }
        .clock-marker:nth-child(3) { bottom: 2px; top: auto; }
        .clock-marker:nth-child(4) { top: 50%; left: 2px; transform: translateY(-50%); width: 4px; height: 2px; }
        
        .digital-time-container {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .clock-time {
          font-size: 1.2rem;
          font-weight: bold;
          color: var(--hacker-primary);
          text-shadow: var(--hacker-glow) var(--hacker-primary);
          letter-spacing: 0.05em;
        }
        
        .clock-date {
          font-size: 0.8rem;
          color: var(--hacker-secondary);
          opacity: 0.9;
        }
        
        @media (max-width: 768px) {
          .hacker-clock-widget {
            padding: 8px 12px;
            gap: 10px;
          }
          
          .analog-clock {
            width: 50px;
            height: 50px;
          }
          
          .hour-hand { height: 16px; }
          .minute-hand { height: 22px; }
          .second-hand { height: 24px; }
          
          .clock-time { font-size: 1rem; }
          .clock-date { font-size: 0.7rem; }
        }
      `}</style>
      
      <div className={`relative ${className}`}>
        {/* Compact Hacker Clock */}
        <div className="hacker-clock-widget" onClick={handleExpandedView}>
          {/* Analog Clock */}
          <div className="analog-clock">
            <div className="clock-face">
              <div className="clock-marker"></div>
              <div className="clock-marker"></div>
              <div className="clock-marker"></div>
              <div className="clock-marker"></div>
              <div ref={hourHandRef} className="hand hour-hand"></div>
              <div ref={minuteHandRef} className="hand minute-hand"></div>
              <div ref={secondHandRef} className="hand second-hand"></div>
            </div>
          </div>
          
          {/* Digital Time Display */}
          <div className="digital-time-container">
            <div className="clock-time">{formatTime(currentTime)}</div>
            <div className="clock-date hidden sm:block">{formatDate(currentTime)}</div>
          </div>
        </div>

        {/* Expanded Clock Panel */}
        {showExpanded && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40 bg-black/95 backdrop-blur-sm"
              onClick={() => setShowExpanded(false)}
            />
            
            {/* Expanded Panel */}
            <div className="fixed inset-4 z-50 bg-black/90 border-2 border-green-400 rounded-lg p-6 shadow-2xl overflow-auto font-mono">
              <button
                onClick={() => setShowExpanded(false)}
                className="absolute top-4 right-4 px-4 py-2 bg-transparent border border-green-400 text-green-400 rounded hover:bg-green-400 hover:text-black transition-colors"
              >
                CLOSE
              </button>
              
              <div className="text-center">
                <h2 className="text-3xl md:text-6xl font-bold text-green-400 mb-4 text-shadow-lg">
                  {formatTime(currentTime)}
                </h2>
                <p className="text-xl text-blue-400 mb-6">
                  {formatDate(currentTime)}
                </p>

                {/* Location Info */}
                <div className="mb-6">
                  <p className="text-blue-400 mb-2">
                    LOCATION: {userLocation || 'DETECTING...'}
                  </p>
                  {ispDetails && (
                    <p className="text-purple-400 text-sm">
                      ISP: {ispDetails.isp} | IP: {ispDetails.ip}
                    </p>
                  )}
                </div>

                {/* Time Zones Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {timeZones.map((tz, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded border transition-all hover:bg-green-400/10 hover:border-green-400 ${
                        index === 0 ? 'border-blue-400 bg-blue-400/10' : 'border-green-400/30 bg-green-400/5'
                      }`}
                    >
                      <div className="text-xs text-blue-400 mb-1">{tz.name}</div>
                      <div className="text-lg font-mono text-green-400">{tz.time}</div>
                    </div>
                  ))}
                </div>

                {/* Controls */}
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={handleThemeChange}
                    className="flex items-center gap-2 px-4 py-2 bg-transparent border border-green-400 text-green-400 rounded hover:bg-green-400 hover:text-black transition-colors"
                  >
                    <Palette className="w-4 h-4" />
                    THEME
                  </button>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="flex items-center gap-2 px-4 py-2 bg-transparent border border-green-400 text-green-400 rounded hover:bg-green-400 hover:text-black transition-colors"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    SOUND: {soundEnabled ? 'ON' : 'OFF'}
                  </button>
                  <button
                    onClick={() => setIs24Hour(!is24Hour)}
                    className="flex items-center gap-2 px-4 py-2 bg-transparent border border-green-400 text-green-400 rounded hover:bg-green-400 hover:text-black transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    FORMAT: {is24Hour ? '24H' : '12H'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HackerClock;