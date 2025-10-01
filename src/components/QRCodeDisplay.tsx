import { useState, useEffect } from 'react';
import { QRCodeGenerator } from '@/utils/qrCodeGenerator';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCodeDisplay = ({ value, size = 60, className = '' }: QRCodeDisplayProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      setLoading(true);
      try {
        const url = QRCodeGenerator.generate(value, size);
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    if (value) {
      generateQR();
    }
  }, [value, size]);

  if (loading) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse rounded ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (!qrCodeUrl) {
    return (
      <div 
        className={`bg-gray-100 rounded flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <svg 
          className="w-3/4 h-3/4 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <rect x="7" y="7" width="3" height="3" />
          <rect x="14" y="7" width="3" height="3" />
          <rect x="7" y="14" width="3" height="3" />
          <rect x="14" y="14" width="3" height="3" />
        </svg>
      </div>
    );
  }

  return (
    <img 
      src={qrCodeUrl} 
      alt="QR Code" 
      className={className}
      style={{ width: size, height: size }}
    />
  );
};
