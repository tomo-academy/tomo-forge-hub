export class QRCodeGenerator {
  private static readonly MODE_BYTE = 0x04;
  private static readonly MODE_ALPHANUMERIC = 0x02;
  private static readonly MODE_NUMERIC = 0x01;
  private static readonly ECC_LEVEL_M = 0x01;
  private static readonly ECC_LEVEL_L = 0x00;

  static generate(text: string, size: number = 200): string {
    const moduleCount = this.getModuleCount(text.length);
    const modules = this.createModules(text, moduleCount);
    return this.renderToCanvas(modules, size);
  }

  private static getModuleCount(textLength: number): number {
    if (textLength <= 25) return 21;
    if (textLength <= 47) return 25;
    if (textLength <= 77) return 29;
    if (textLength <= 114) return 33;
    return 37;
  }

  private static createModules(text: string, moduleCount: number): boolean[][] {
    const modules: boolean[][] = Array(moduleCount).fill(null).map(() => Array(moduleCount).fill(false));
    
    // Add position markers
    this.addPositionMarkers(modules, 0, 0);
    this.addPositionMarkers(modules, moduleCount - 7, 0);
    this.addPositionMarkers(modules, 0, moduleCount - 7);
    
    // Add timing patterns
    this.addTimingPatterns(modules);
    
    // Add data
    this.addData(modules, text);
    
    // Add mask patterns
    this.applyMask(modules);
    
    return modules;
  }

  private static addPositionMarkers(modules: boolean[][], row: number, col: number): void {
    const marker = [
      [1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1]
    ];
    
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (row + i < modules.length && col + j < modules[0].length) {
          modules[row + i][col + j] = marker[i][j] === 1;
        }
      }
    }
  }

  private static addTimingPatterns(modules: boolean[][]): void {
    const size = modules.length;
    
    // Horizontal timing pattern
    for (let i = 8; i < size - 8; i++) {
      modules[6][i] = i % 2 === 0;
      modules[i][6] = i % 2 === 0;
    }
  }

  private static addData(modules: boolean[][], text: string): void {
    const data = this.encodeText(text);
    let index = 0;
    
    // Start from bottom-right and move in a zigzag pattern
    let row = modules.length - 1;
    let col = modules.length - 1;
    let direction = -1;
    
    while (row > 0) {
      if (col === modules.length) {
        row -= 2;
        col = row === 6 ? 0 : modules.length - 1;
        direction = -direction;
      }
      
      if (this.isFunctionModule(modules, row, col)) {
        col += direction;
        continue;
      }
      
      if (index < data.length) {
        modules[row][col] = data[index];
        index++;
      }
      
      col += direction;
    }
  }

  private static isFunctionModule(modules: boolean[][], row: number, col: number): boolean {
    const size = modules.length;
    
    // Position markers
    if ((row < 9 && col < 9) || (row < 9 && col >= size - 8) || (row >= size - 8 && col < 9)) {
      return true;
    }
    
    // Timing patterns
    if (row === 6 || col === 6) {
      return true;
    }
    
    return false;
  }

  private static encodeText(text: string): boolean[] {
    const data: boolean[] = [];
    
    // Add mode indicator
    data.push(...this.toBits(this.MODE_BYTE, 4));
    
    // Add character count indicator
    data.push(...this.toBits(text.length, 8));
    
    // Add data
    for (let i = 0; i < text.length; i++) {
      data.push(...this.toBits(text.charCodeAt(i), 8));
    }
    
    // Add terminator
    data.push(false, false, false, false);
    
    // Pad to byte boundary
    while (data.length % 8 !== 0) {
      data.push(false);
    }
    
    // Add padding
    const paddingPattern = [true, false, false, true, true, true, false, false];
    let paddingIndex = 0;
    
    while (data.length < this.getDataCapacity(text.length)) {
      data.push(paddingPattern[paddingIndex % 8]);
      paddingIndex++;
    }
    
    return data;
  }

  private static toBits(value: number, length: number): boolean[] {
    const bits: boolean[] = [];
    for (let i = length - 1; i >= 0; i--) {
      bits.push((value & (1 << i)) !== 0);
    }
    return bits;
  }

  private static getDataCapacity(textLength: number): number {
    const moduleCount = this.getModuleCount(textLength);
    const totalModules = moduleCount * moduleCount;
    const functionModules = 192; // Approximate
    const dataModules = totalModules - functionModules;
    return Math.floor(dataModules / 8);
  }

  private static applyMask(modules: boolean[][]): void {
    const maskPattern = 0b010; // Use mask pattern 010
    const size = modules.length;
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (this.isFunctionModule(modules, row, col)) continue;
        
        const condition = (row + col) % 2 === 0;
        if (condition) {
          modules[row][col] = !modules[row][col];
        }
      }
    }
  }

  private static renderToCanvas(modules: boolean[][], size: number): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const moduleSize = Math.floor(size / modules.length);
    
    canvas.width = size;
    canvas.height = size;
    
    if (!ctx) return '';
    
    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    
    // Draw modules
    ctx.fillStyle = '#000000';
    for (let row = 0; row < modules.length; row++) {
      for (let col = 0; col < modules[row].length; col++) {
        if (modules[row][col]) {
          ctx.fillRect(
            col * moduleSize,
            row * moduleSize,
            moduleSize,
            moduleSize
          );
        }
      }
    }
    
    // Add decorative elements
    this.addDecorativeElements(ctx, size);
    
    return canvas.toDataURL('image/png');
  }

  private static addDecorativeElements(ctx: CanvasRenderingContext2D, size: number): void {
    // Add gradient overlay
    const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.05)');
    gradient.addColorStop(1, 'rgba(147, 51, 234, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Add corner decorations
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.lineWidth = 2;
    
    // Top-left corner
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, 10);
    ctx.stroke();
    
    // Top-right corner
    ctx.beginPath();
    ctx.moveTo(size - 10, 0);
    ctx.lineTo(size, 0);
    ctx.lineTo(size, 10);
    ctx.stroke();
    
    // Bottom-left corner
    ctx.beginPath();
    ctx.moveTo(0, size - 10);
    ctx.lineTo(0, size);
    ctx.lineTo(10, size);
    ctx.stroke();
    
    // Bottom-right corner
    ctx.beginPath();
    ctx.moveTo(size - 10, size);
    ctx.lineTo(size, size);
    ctx.lineTo(size, size - 10);
    ctx.stroke();
  }
}
