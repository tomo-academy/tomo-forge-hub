import React, { useState, useEffect } from 'react';

interface LocationData {
  city: string;
  region: string;
  country_name: string;
  ip: string;
  org: string;
}

interface HackerClockProps {
  isHeaderMode?: boolean;
  className?: string;
}

const HackerClock: React.FC<HackerClockProps> = ({ isHeaderMode = false, className = '' }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  const themes = [
    { primary: '#00ff41', secondary: '#00d4ff' },
    { primary: '#ff0080', secondary: '#00ff88' },
    { primary: '#00d4ff', secondary: '#ff00ff' },
    { primary: '#ffff00', secondary: '#ff0080' }
  ];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Play tick sound every 5 seconds
      if (soundEnabled && now.getSeconds() % 5 === 0) {
        playTickSound();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [soundEnabled]);

  // Fetch location data when expanded view is opened
  useEffect(() => {
    if (isExpanded && !locationData) {
      fetchLocationData();
    }
  }, [isExpanded, locationData]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isExpanded]);

  const fetchLocationData = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setLocationData(data);
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  const playTickSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Silently handle audio context errors
    }
  };

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    if (is24Hour) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${period}`;
    }
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

  const toggleTheme = () => {
    const nextTheme = (currentTheme + 1) % themes.length;
    setCurrentTheme(nextTheme);
    
    // Apply theme to CSS variables
    const theme = themes[nextTheme];
    document.documentElement.style.setProperty('--hacker-primary', theme.primary);
    document.documentElement.style.setProperty('--hacker-secondary', theme.secondary);
  };

  // Header mode styles (compact for navbar)
  const headerStyles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.9rem',
    },
    clockTime: {
      color: 'var(--hacker-primary, #00ff41)',
      fontWeight: 'bold' as const,
      textShadow: '0 0 5px var(--hacker-primary, #00ff41)',
      letterSpacing: '0.05em',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    clockIcon: {
      color: 'var(--hacker-primary, #00ff41)',
      fontSize: '1rem',
    },
  };

  const expandedStyles = {
    container: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.95)',
      zIndex: 2000,
      display: isExpanded ? 'flex' : 'none',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Courier New', monospace",
      color: 'var(--hacker-primary, #00ff41)',
    },
    content: {
      background: 'rgba(0, 0, 0, 0.8)',
      border: '2px solid var(--hacker-primary, #00ff41)',
      borderRadius: '10px',
      padding: '30px',
      boxShadow: '0 0 50px rgba(0, 255, 65, 0.5), inset 0 0 30px rgba(0, 255, 65, 0.1)',
      backdropFilter: 'blur(10px)',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      maxWidth: '90vw',
      textAlign: 'center' as const,
    },
    time: {
      fontSize: '4rem',
      fontWeight: 'bold' as const,
      marginBottom: '15px',
      textShadow: '0 0 10px var(--hacker-primary, #00ff41)',
      letterSpacing: '0.1em',
    },
    date: {
      fontSize: '1.2rem',
      color: 'var(--hacker-secondary, #00d4ff)',
      marginBottom: '25px',
    },
    locationInfo: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      marginBottom: '25px',
    },
    locationText: {
      fontSize: '1rem',
      color: 'var(--hacker-secondary, #00d4ff)',
      marginBottom: '5px',
    },
    ispDetails: {
      fontSize: '0.9rem',
      color: '#ff00ff',
    },
    controls: {
      display: 'flex',
      gap: '15px',
      justifyContent: 'center',
      marginTop: '20px',
      flexWrap: 'wrap' as const,
    },
    button: {
      background: 'transparent',
      border: '1px solid var(--hacker-primary, #00ff41)',
      color: 'var(--hacker-primary, #00ff41)',
      padding: '8px 16px',
      cursor: 'pointer',
      borderRadius: '5px',
      fontFamily: 'inherit',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
    },
    closeButton: {
      position: 'absolute' as const,
      top: '20px',
      right: '20px',
      background: 'transparent',
      border: '1px solid var(--hacker-primary, #00ff41)',
      color: 'var(--hacker-primary, #00ff41)',
      padding: '8px 16px',
      cursor: 'pointer',
      borderRadius: '5px',
      fontFamily: 'inherit',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
      zIndex: 2001,
    },
  };

  // Header mode (compact for navbar)
  if (isHeaderMode) {
    return (
      <>
        <div className={`hacker-clock-header ${className}`} style={headerStyles.container}>
          <span style={headerStyles.clockIcon}>⏱️</span>
          <span 
            style={headerStyles.clockTime}
            onClick={() => setIsExpanded(true)}
            title="Click for full clock view"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.textShadow = '0 0 8px var(--hacker-primary, #00ff41)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.textShadow = '0 0 5px var(--hacker-primary, #00ff41)';
            }}
          >
            {formatTime(currentTime)}
          </span>
        </div>
        
        {/* Expanded Clock View */}
        <div style={expandedStyles.container}>
          <button
            style={expandedStyles.closeButton}
            onClick={() => setIsExpanded(false)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--hacker-primary, #00ff41)';
              e.currentTarget.style.color = '#0a0a0a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--hacker-primary, #00ff41)';
            }}
          >
            CLOSE
          </button>
          
          <div style={expandedStyles.content}>
            <div style={expandedStyles.time}>{formatTime(currentTime)}</div>
            <div style={expandedStyles.date}>{formatDate(currentTime)}</div>
            
            <div style={expandedStyles.locationInfo}>
              <div style={expandedStyles.locationText}>
                {locationData 
                  ? `LOCATION: ${locationData.city}, ${locationData.region} ${locationData.country_name}`.toUpperCase()
                  : 'DETECTING LOCATION...'
                }
              </div>
              <div style={expandedStyles.ispDetails}>
                {locationData 
                  ? `ISP: ${locationData.org} | IP: ${locationData.ip}`
                  : ''
                }
              </div>
            </div>
            
            <div style={expandedStyles.controls}>
              <button
                style={expandedStyles.button}
                onClick={toggleTheme}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--hacker-primary, #00ff41)';
                  e.currentTarget.style.color = '#0a0a0a';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--hacker-primary, #00ff41)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                THEME
              </button>
              <button
                style={expandedStyles.button}
                onClick={() => setSoundEnabled(!soundEnabled)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--hacker-primary, #00ff41)';
                  e.currentTarget.style.color = '#0a0a0a';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--hacker-primary, #00ff41)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                SOUND: {soundEnabled ? 'ON' : 'OFF'}
              </button>
              <button
                style={expandedStyles.button}
                onClick={() => setIs24Hour(!is24Hour)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--hacker-primary, #00ff41)';
                  e.currentTarget.style.color = '#0a0a0a';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--hacker-primary, #00ff41)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                FORMAT: {is24Hour ? '24H' : '12H'}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Floating mode (kept for compatibility - not used currently)
  return null;
};

export default HackerClock;