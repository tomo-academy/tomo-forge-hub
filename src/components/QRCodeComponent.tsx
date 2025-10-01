// src/components/QRCodeComponent.tsx
import { useState, useEffect, useRef } from 'react';

interface QRCodeComponentProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCodeComponent = ({ value, size = 60, className = '' }: QRCodeComponentProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !value) return;
    
    setIsGenerating(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      setIsGenerating(false);
      return;
    }
    
    // Set canvas size
    canvas.width = size;
    canvas.height = size;
    
    // Create a simple QR code pattern
    const cellSize = Math.floor(size / 25);
    const margin = Math.floor(cellSize / 2);
    
    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    
    // Draw QR code pattern
    ctx.fillStyle = '#000000';
    
    // Add position markers (corners)
    drawPositionMarker(ctx, margin, margin, cellSize * 7);
    drawPositionMarker(ctx, size - margin - cellSize * 7, margin, cellSize * 7);
    drawPositionMarker(ctx, margin, size - margin - cellSize * 7, cellSize * 7);
    
    // Add timing pattern
    for (let i = 8; i < size - 8; i += 2) {
      ctx.fillRect(i, margin + cellSize * 6, cellSize, cellSize);
      ctx.fillRect(margin + cellSize * 6, i, cellSize, cellSize);
    }
    
    // Add data pattern (simplified)
    const data = value.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0'));
    let dataIndex = 0;
    
    for (let row = 0; row < 17; row++) {
      for (let col = 0; col < 17; col++) {
        if (isFunctionModule(row, col)) continue;
        
        if (dataIndex < data.length) {
          const bits = data[dataIndex];
          for (let bit = 0; bit < 8; bit++) {
            if ((row + col) % 2 === 0) {
              ctx.fillRect(
                margin + col * cellSize,
                margin + row * cellSize,
                cellSize,
                cellSize
              );
            }
          }
          dataIndex++;
        }
      }
    }
    
    // Add decorative elements
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.lineWidth = 1;
    
    // Top-left corner
    ctx.beginPath();
    ctx.moveTo(5, 5);
    ctx.lineTo(5, 15);
    ctx.stroke();
    
    // Top-right corner
    ctx.beginPath();
    ctx.moveTo(size - 5, 5);
    ctx.lineTo(size - 15, 5);
    ctx.stroke();
    
    // Bottom-left corner
    ctx.beginPath();
    ctx.moveTo(5, size - 5);
    ctx.lineTo(5, size - 15);
    ctx.stroke();
    
    // Bottom-right corner
    ctx.beginPath();
    ctx.moveTo(size - 5, size - 5);
    ctx.lineTo(size - 15, size - 5);
    ctx.stroke();
    
    // Convert to data URL
    const url = canvas.toDataURL('image/png');
    setQrCodeUrl(url);
    setIsGenerating(false);
  }, [value, size]);

  function isFunctionModule(row: number, col: number): boolean {
    // Position markers
    if ((row < 9 && col < 9) || (row < 9 && col >= 17) || (row >= 17 && col < 9)) {
      return true;
    }
    
    // Timing patterns
    if (row === 6 || col === 6) {
      return true;
    }
    
    return false;
  }

  function drawPositionMarker(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    // Outer square
    ctx.fillRect(x, y, size, size);
    
    // Inner square
    ctx.fillStyle = '#FFFFFF';
    const innerSize = size * 3 / 7;
    const innerOffset = size * 2 / 7;
    ctx.fillRect(x + innerOffset, y + innerOffset, innerSize, innerSize);
    
    // Center dot
    ctx.fillStyle = '#000000';
    const dotSize = size / 7;
    ctx.fillRect(x + size * 3 / 7 - dotSize / 2, y + size * 3 / 7 - dotSize / 2, dotSize, dotSize);
  }

  if (isGenerating) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse rounded ${className}`}
        style={{ width: size, height: size }}
      />
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
