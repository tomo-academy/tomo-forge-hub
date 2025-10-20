// src/components/SimpleQRCode.tsx
import { useState } from 'react';

interface SimpleQRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export const SimpleQRCode = ({ value, size = 150, className = '' }: SimpleQRCodeProps) => {
  const [hasError, setHasError] = useState(false);
  
  if (!value || hasError) {
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-xs ${className}`}
        style={{ width: size, height: size }}
      >
        QR Code
      </div>
    );
  }

  // Use QR Server API for reliable QR code generation
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&format=png&margin=10`;

  return (
    <img
      src={qrUrl}
      alt="QR Code"
      className={`rounded-lg ${className}`}
      style={{ width: size, height: size }}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
};

export default SimpleQRCode;