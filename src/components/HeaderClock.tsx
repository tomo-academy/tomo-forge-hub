import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, Globe, Volume2, VolumeX, Palette, Settings, X } from 'lucide-react';

interface HackerClockProps {
  className?: string;
}

const HackerClock: React.FC<HackerClockProps> = ({ className = '' }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('');
  const [userTimezone, setUserTimezone] = useState<string>('');
  const [ispDetails, setIspDetails] = useState<{ip: string, isp: string} | null>(null);

  const hourHandRef = useRef<HTMLDivElement>(null);
  const minuteHandRef = useRef<HTMLDivElement>(null);
  const secondHandRef = useRef<HTMLDivElement>(null);
  const modalHourHandRef = useRef<HTMLDivElement>(null);
  const modalMinuteHandRef = useRef<HTMLDivElement>(null);
  const modalSecondHandRef = useRef<HTMLDivElement>(null);

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
    
    // Update compact clock in header
    if (hourHandRef.current) {
      hourHandRef.current.style.transform = `translate(-50%, -100%) rotate(${hourAngle}deg)`;
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.style.transform = `translate(-50%, -100%) rotate(${minuteAngle}deg)`;
    }
    if (secondHandRef.current) {
      secondHandRef.current.style.transform = `translate(-50%, -100%) rotate(${secondAngle}deg)`;
    }

    // Update modal clock if open
    if (modalHourHandRef.current) {
      modalHourHandRef.current.style.transform = `translate(-50%, -100%) rotate(${hourAngle}deg)`;
    }
    if (modalMinuteHandRef.current) {
      modalMinuteHandRef.current.style.transform = `translate(-50%, -100%) rotate(${minuteAngle}deg)`;
    }
    if (modalSecondHandRef.current) {
      modalSecondHandRef.current.style.transform = `translate(-50%, -100%) rotate(${secondAngle}deg)`;
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
    setShowModal(!showModal);
    if (!userLocation && !showModal) {
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
          --hacker-glow: 0 0 8px;
        }
        
        .compact-clock {
          background: rgba(0, 15, 0, 0.95);
          border: 1px solid var(--hacker-primary);
          border-radius: 6px;
          padding: 6px 10px;
          box-shadow: var(--hacker-glow) var(--hacker-primary);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Courier New', monospace;
          min-width: fit-content;
        }
        
        .compact-clock:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 12px var(--hacker-primary);
          background: rgba(0, 25, 0, 0.95);
        }
        
        .mini-analog-clock {
          width: 32px;
          height: 32px;
          position: relative;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid var(--hacker-primary);
          border-radius: 50%;
          box-shadow: inset 0 0 4px var(--hacker-primary);
          flex-shrink: 0;
        }
        
        .mini-analog-clock::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 3px;
          height: 3px;
          background: var(--hacker-primary);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          box-shadow: 0 0 3px var(--hacker-primary);
        }
        
        .mini-hand {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: 50% 100%;
          border-radius: 1px;
        }
        
        .mini-hour-hand {
          width: 1.5px;
          height: 8px;
          background: var(--hacker-primary);
          box-shadow: 0 0 2px var(--hacker-primary);
        }
        
        .mini-minute-hand {
          width: 1px;
          height: 12px;
          background: var(--hacker-secondary);
          box-shadow: 0 0 2px var(--hacker-secondary);
        }
        
        .mini-second-hand {
          width: 0.5px;
          height: 14px;
          background: #ff0080;
          box-shadow: 0 0 2px #ff0080;
        }
        
        .compact-time {
          font-size: 0.875rem;
          font-weight: bold;
          color: var(--hacker-primary);
          text-shadow: 0 0 3px var(--hacker-primary);
          letter-spacing: 0.5px;
          line-height: 1;
        }
        
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.98);
          backdrop-filter: blur(10px);
          z-index: 9999;
          display: flex;
          /* anchor modal a bit lower so it doesn't overlap header content */
          align-items: flex-start;
          justify-content: center;
          padding: 6vh 1rem 2rem 1rem;
          animation: backdropFadeIn 0.4s ease-out;
        }
        
        @keyframes backdropFadeIn {
          from {
            background: rgba(0, 0, 0, 0);
            backdrop-filter: blur(0px);
          }
          to {
            background: rgba(0, 0, 0, 0.98);
            backdrop-filter: blur(10px);
          }
        }
        
        .modal-content {
          background: linear-gradient(145deg, 
            rgba(0, 10, 20, 0.95), 
            rgba(0, 30, 40, 0.92), 
            rgba(0, 50, 60, 0.88)
          );
          border: 2px solid var(--hacker-primary);
          border-radius: 16px;
          padding: 1.5rem;
          max-width: 90vw;
          /* leave room for the top page header so modal is fully visible */
          max-height: calc(80vh);
          width: 100%;
          max-width: 650px;
          overflow-y: auto;
          box-shadow: 
            0 0 30px var(--hacker-primary),
            0 0 60px rgba(0, 255, 65, 0.2),
            inset 0 0 20px rgba(0, 255, 65, 0.05);
          position: relative;
          font-family: 'Courier New', monospace;
          animation: modalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.2);
        }
        
        @keyframes modalSlideIn {
          from {
            transform: scale(0.7) translateY(50px);
            opacity: 0;
            filter: blur(5px);
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
            filter: blur(0px);
          }
        }
        
        .modal-close-button {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: linear-gradient(145deg, rgba(255, 0, 0, 0.8), rgba(255, 50, 50, 0.9));
          border: 2px solid #ff4444;
          color: white;
          padding: 0.75rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3);
          font-weight: bold;
          z-index: 10;
        }
        
        .modal-close-button:hover {
          background: linear-gradient(145deg, #ff4444, #ff6666);
          box-shadow: 0 6px 25px rgba(255, 0, 0, 0.5);
          transform: translateY(-2px) scale(1.05);
        }
        
        .modal-header {
          text-align: center;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(0, 255, 65, 0.3);
        }
        
        .modal-title {
          font-size: 1.5rem;
          font-weight: bold;
          background: linear-gradient(45deg, var(--hacker-primary), var(--hacker-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.25rem;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        
        .modal-subtitle {
          color: var(--hacker-secondary);
          opacity: 0.8;
          font-size: 0.875rem;
        }
        
        .modal-body {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        
        .clock-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .modal-analog-clock {
          width: 160px;
          height: 160px;
          position: relative;
          background: radial-gradient(circle at 30% 30%, 
            rgba(0, 255, 65, 0.1), 
            rgba(0, 0, 0, 0.9), 
            rgba(0, 20, 0, 0.95)
          );
          border: 3px solid var(--hacker-primary);
          border-radius: 50%;
          box-shadow: 
            0 0 25px var(--hacker-primary),
            0 0 50px rgba(0, 255, 65, 0.3),
            inset 0 0 30px rgba(0, 255, 65, 0.1);
          margin-bottom: 1.5rem;
          /* initial subtle glow + drop-in animation when modal opens */
          animation: clockGlow 3s ease-in-out infinite alternate, clockDropIn 600ms cubic-bezier(0.22, 1, 0.36, 1) both;
          animation-delay: 0s, 140ms; /* run glow immediately, drop-in shortly after modal appears */
        }
        
        @keyframes clockGlow {
          from {
            box-shadow: 
              0 0 30px var(--hacker-primary),
              0 0 60px rgba(0, 255, 65, 0.3),
              inset 0 0 40px rgba(0, 255, 65, 0.1);
          }
          to {
            box-shadow: 
              0 0 40px var(--hacker-primary),
              0 0 80px rgba(0, 255, 65, 0.5),
              inset 0 0 50px rgba(0, 255, 65, 0.2);
          }
        }

        @keyframes clockDropIn {
          0% {
            transform: translateY(-24px) scale(0.98);
            opacity: 0;
            filter: blur(4px);
          }
          60% {
            transform: translateY(6px) scale(1.02);
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
            filter: none;
          }
        }

        /* Back button in top-left of modal */
        .modal-back-button {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: linear-gradient(145deg, rgba(0, 120, 255, 0.12), rgba(0, 120, 255, 0.18));
          border: 2px solid rgba(0, 120, 255, 0.25);
          color: var(--hacker-primary);
          padding: 0.5rem 0.65rem;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 700;
          font-size: 0.8rem;
          z-index: 11;
        }
        
        .modal-analog-clock::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 12px;
          height: 12px;
          background: radial-gradient(circle, var(--hacker-primary), rgba(0, 255, 65, 0.8));
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          box-shadow: 0 0 15px var(--hacker-primary);
        }
        
        .modal-hand {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: 50% 100%;
          border-radius: 3px;
          filter: drop-shadow(0 0 5px currentColor);
        }
        
        .modal-hour-hand {
          width: 4px;
          height: 60px;
          background: linear-gradient(to top, var(--hacker-primary), rgba(0, 255, 65, 0.8));
          box-shadow: 0 0 10px var(--hacker-primary);
        }
        
        .modal-minute-hand {
          width: 3px;
          height: 80px;
          background: linear-gradient(to top, var(--hacker-secondary), rgba(0, 212, 255, 0.8));
          box-shadow: 0 0 8px var(--hacker-secondary);
        }
        
        .modal-second-hand {
          width: 2px;
          height: 90px;
          background: linear-gradient(to top, #ff0080, #ff4db8);
          box-shadow: 0 0 6px #ff0080;
          animation: secondTick 1s linear infinite;
        }
        
        @keyframes secondTick {
          0%, 95% { opacity: 1; }
          96%, 100% { opacity: 0.7; }
        }
        
        .clock-numbers {
          position: absolute;
          width: 100%;
          height: 100%;
          font-size: 14px;
          font-weight: bold;
          color: var(--hacker-primary);
        }
        
        .clock-number {
          position: absolute;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 255, 65, 0.1);
          border: 1px solid var(--hacker-primary);
          border-radius: 50%;
          text-shadow: 0 0 5px var(--hacker-primary);
          font-size: 12px;
        }
        
        .clock-number:nth-child(1) { top: 8px; left: 50%; transform: translateX(-50%); }
        .clock-number:nth-child(2) { top: 20px; right: 20px; }
        .clock-number:nth-child(3) { top: 50%; right: 8px; transform: translateY(-50%); }
        .clock-number:nth-child(4) { bottom: 20px; right: 20px; }
        .clock-number:nth-child(5) { bottom: 8px; left: 50%; transform: translateX(-50%); }
        .clock-number:nth-child(6) { bottom: 20px; left: 20px; }
        .clock-number:nth-child(7) { top: 50%; left: 8px; transform: translateY(-50%); }
        .clock-number:nth-child(8) { top: 20px; left: 20px; }
        
        .time-info-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .digital-time-display {
          background: rgba(0, 0, 0, 0.7);
          border: 2px solid var(--hacker-primary);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
        }
        
        .modal-main-time {
          font-size: 2.5rem;
          font-weight: bold;
          color: var(--hacker-primary);
          text-shadow: 0 0 15px var(--hacker-primary);
          margin-bottom: 0.75rem;
          letter-spacing: 2px;
          font-family: 'Courier New', monospace;
          animation: timeGlow 2s ease-in-out infinite alternate;
        }
        
        @keyframes timeGlow {
          from { text-shadow: 0 0 20px var(--hacker-primary); }
          to { text-shadow: 0 0 30px var(--hacker-primary), 0 0 40px var(--hacker-primary); }
        }
        
        .modal-date {
          font-size: 1.125rem;
          color: var(--hacker-secondary);
          margin-bottom: 0.75rem;
          font-weight: 600;
        }
        
        .location-info {
          background: rgba(0, 40, 60, 0.6);
          border: 1px solid var(--hacker-secondary);
          border-radius: 8px;
          padding: 0.75rem;
          margin-bottom: 0.75rem;
        }
        
        .timezone-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        
        .timezone-card {
          background: linear-gradient(145deg, rgba(0, 0, 0, 0.8), rgba(0, 20, 30, 0.9));
          border: 2px solid transparent;
          background-clip: padding-box;
          border-radius: 8px;
          padding: 0.875rem;
          text-align: center;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        
        .timezone-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, var(--hacker-primary), var(--hacker-secondary));
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }
        
        .timezone-card:hover::before {
          opacity: 0.1;
        }
        
        .timezone-card:hover {
          border-color: var(--hacker-primary);
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 8px 25px rgba(0, 255, 65, 0.3);
        }
        
        .timezone-name {
          font-size: 0.8rem;
          color: var(--hacker-secondary);
          margin-bottom: 0.5rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .timezone-time {
          font-size: 1.125rem;
          font-weight: bold;
          color: var(--hacker-primary);
          text-shadow: 0 0 6px var(--hacker-primary);
          font-family: 'Courier New', monospace;
        }
        
        .controls-section {
          grid-column: 1 / -1;
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(0, 255, 65, 0.3);
        }
        
        .control-button {
          background: linear-gradient(145deg, rgba(0, 0, 0, 0.8), rgba(0, 30, 40, 0.9));
          border: 2px solid var(--hacker-primary);
          color: var(--hacker-primary);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.4s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
          overflow: hidden;
        }
        
        .control-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 65, 0.3), transparent);
          transition: left 0.5s ease;
        }
        
        .control-button:hover::before {
          left: 100%;
        }
        
        .control-button:hover {
          background: var(--hacker-primary);
          color: black;
          box-shadow: 0 0 20px var(--hacker-primary);
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .modal-content {
            padding: 1.25rem;
            margin: 0.5rem;
            max-width: 95vw;
          }
          
          .modal-body {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .modal-analog-clock {
            width: 180px;
            height: 180px;
          }
          
          .modal-main-time { font-size: 2rem; }
          .timezone-grid { grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); }
          
          .modal-close-button {
            top: 1rem;
            right: 1rem;
            padding: 0.5rem;
          }
        }
      `}</style>
      
      <div className={`relative ${className}`}>
        {/* Compact Header Clock */}
        <div className="compact-clock" onClick={handleExpandedView}>
          <div className="mini-analog-clock">
            <div ref={hourHandRef} className="mini-hand mini-hour-hand"></div>
            <div ref={minuteHandRef} className="mini-hand mini-minute-hand"></div>
            <div ref={secondHandRef} className="mini-hand mini-second-hand"></div>
          </div>
          <div className="compact-time hidden sm:block">
            {formatTime(currentTime).split(' ')[0]}
          </div>
        </div>

        {/* Modal Popup */}
        {showModal && (
          <div className="modal-backdrop" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-button" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
              
              {/* Back button for easier dismissal and better UX */}
              <button className="modal-back-button" onClick={() => setShowModal(false)} aria-label="Back">
                ⤺ Back
              </button>
              <div className="modal-header">
                <div className="modal-title">Quantum Time Portal</div>
                <div className="modal-subtitle">Advanced Temporal Interface</div>
              </div>
              
              <div className="modal-body">
                <div className="clock-section">
                  <div className="modal-analog-clock">
                    <div className="clock-numbers">
                      <div className="clock-number">12</div>
                      <div className="clock-number">1</div>
                      <div className="clock-number">3</div>
                      <div className="clock-number">4</div>
                      <div className="clock-number">6</div>
                      <div className="clock-number">7</div>
                      <div className="clock-number">9</div>
                      <div className="clock-number">10</div>
                    </div>
                    <div ref={modalHourHandRef} className="modal-hand modal-hour-hand"></div>
                    <div ref={modalMinuteHandRef} className="modal-hand modal-minute-hand"></div>
                    <div ref={modalSecondHandRef} className="modal-hand modal-second-hand"></div>
                  </div>
                </div>
                
                <div className="time-info-section">
                  <div className="digital-time-display">
                    <div className="modal-main-time">{formatTime(currentTime)}</div>
                    <div className="modal-date">{formatDate(currentTime)}</div>
                    
                    {userLocation && (
                      <div className="location-info">
                        <div style={{ color: 'var(--hacker-secondary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                          📍 {userLocation}
                        </div>
                        {ispDetails && (
                          <div style={{ fontSize: '0.9rem', opacity: 0.8, color: 'var(--hacker-primary)' }}>
                            ISP: {ispDetails.isp} | IP: {ispDetails.ip}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="timezone-grid">
                    {timeZones.map((tz, index) => (
                      <div key={index} className="timezone-card">
                        <div className="timezone-name">{tz.name}</div>
                        <div className="timezone-time">{tz.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="controls-section">
                <button className="control-button" onClick={handleThemeChange}>
                  <Palette size={18} />
                  Theme Cycle
                </button>
                <button className="control-button" onClick={() => setSoundEnabled(!soundEnabled)}>
                  {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  Audio: {soundEnabled ? 'ON' : 'OFF'}
                </button>
                <button className="control-button" onClick={() => setIs24Hour(!is24Hour)}>
                  <Settings size={18} />
                  Format: {is24Hour ? '24H' : '12H'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HackerClock;