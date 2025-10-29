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
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(5px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        
        .modal-content {
          background: linear-gradient(135deg, rgba(0, 20, 0, 0.95), rgba(0, 40, 0, 0.9));
          border: 2px solid var(--hacker-primary);
          border-radius: 12px;
          padding: 2rem;
          max-width: 90vw;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 0 30px var(--hacker-primary), inset 0 0 20px rgba(0, 255, 65, 0.1);
          position: relative;
          font-family: 'Courier New', monospace;
          animation: modalSlideIn 0.3s ease-out;
        }
        
        @keyframes modalSlideIn {
          from {
            transform: scale(0.9) translateY(20px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        
        .modal-analog-clock {
          width: 200px;
          height: 200px;
          position: relative;
          background: radial-gradient(circle, rgba(0, 0, 0, 0.8), rgba(0, 20, 0, 0.9));
          border: 3px solid var(--hacker-primary);
          border-radius: 50%;
          box-shadow: 
            0 0 20px var(--hacker-primary),
            inset 0 0 30px rgba(0, 255, 65, 0.2);
          margin: 0 auto 2rem;
        }
        
        .modal-analog-clock::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          background: var(--hacker-primary);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          box-shadow: 0 0 10px var(--hacker-primary);
        }
        
        .modal-hand {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: 50% 100%;
          border-radius: 2px;
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
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .clock-number:nth-child(1) { top: 5px; left: 50%; transform: translateX(-50%); }
        .clock-number:nth-child(2) { top: 15px; right: 15px; }
        .clock-number:nth-child(3) { top: 50%; right: 5px; transform: translateY(-50%); }
        .clock-number:nth-child(4) { bottom: 15px; right: 15px; }
        .clock-number:nth-child(5) { bottom: 5px; left: 50%; transform: translateX(-50%); }
        .clock-number:nth-child(6) { bottom: 15px; left: 15px; }
        .clock-number:nth-child(7) { top: 50%; left: 5px; transform: translateY(-50%); }
        .clock-number:nth-child(8) { top: 15px; left: 15px; }
        
        .modal-time-display {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .modal-main-time {
          font-size: 3rem;
          font-weight: bold;
          color: var(--hacker-primary);
          text-shadow: 0 0 15px var(--hacker-primary);
          margin-bottom: 0.5rem;
          letter-spacing: 2px;
        }
        
        .modal-date {
          font-size: 1.25rem;
          color: var(--hacker-secondary);
          margin-bottom: 1rem;
        }
        
        .timezone-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .timezone-card {
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid var(--hacker-primary);
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .timezone-card:hover {
          background: rgba(0, 255, 65, 0.1);
          border-color: var(--hacker-secondary);
          transform: translateY(-2px);
        }
        
        .timezone-name {
          font-size: 0.875rem;
          color: var(--hacker-secondary);
          margin-bottom: 0.5rem;
        }
        
        .timezone-time {
          font-size: 1.25rem;
          font-weight: bold;
          color: var(--hacker-primary);
          text-shadow: 0 0 5px var(--hacker-primary);
        }
        
        .controls-section {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }
        
        .control-button {
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid var(--hacker-primary);
          color: var(--hacker-primary);
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Courier New', monospace;
          font-weight: bold;
        }
        
        .control-button:hover {
          background: var(--hacker-primary);
          color: black;
          box-shadow: 0 0 10px var(--hacker-primary);
        }
        
        .close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 0, 0, 0.8);
          border: 1px solid #ff4444;
          color: white;
          padding: 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .close-button:hover {
          background: #ff4444;
          box-shadow: 0 0 10px #ff4444;
        }
        
        @media (max-width: 768px) {
          .compact-clock {
            padding: 4px 8px;
            gap: 6px;
          }
          
          .mini-analog-clock {
            width: 28px;
            height: 28px;
          }
          
          .mini-hour-hand { height: 6px; }
          .mini-minute-hand { height: 10px; }
          .mini-second-hand { height: 12px; }
          
          .compact-time { font-size: 0.75rem; }
          
          .modal-content {
            padding: 1rem;
            margin: 0.5rem;
          }
          
          .modal-analog-clock {
            width: 150px;
            height: 150px;
          }
          
          .modal-main-time { font-size: 2rem; }
          .timezone-grid { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
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
              <button className="close-button" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
              
              <div className="modal-time-display">
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
                
                <div className="modal-main-time">{formatTime(currentTime)}</div>
                <div className="modal-date">{formatDate(currentTime)}</div>
                
                {userLocation && (
                  <div style={{ color: 'var(--hacker-secondary)', marginBottom: '1rem' }}>
                    📍 {userLocation}
                    {ispDetails && (
                      <div style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '0.5rem' }}>
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

              <div className="controls-section">
                <button className="control-button" onClick={handleThemeChange}>
                  <Palette size={16} />
                  THEME
                </button>
                <button className="control-button" onClick={() => setSoundEnabled(!soundEnabled)}>
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  SOUND: {soundEnabled ? 'ON' : 'OFF'}
                </button>
                <button className="control-button" onClick={() => setIs24Hour(!is24Hour)}>
                  <Settings size={16} />
                  FORMAT: {is24Hour ? '24H' : '12H'}
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