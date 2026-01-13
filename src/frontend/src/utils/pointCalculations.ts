export function calculateMoneyFromPoints(points: number, rate: number): number {
  return (points / 100) * rate;
}

export function validatePointValue(value: number, max: number): string {
  if (isNaN(value)) return "Không hợp lệ";
  if (value < 100) return "Tối thiểu 100 điểm";
  if (value > max) return `Tối đa ${max} điểm`;
  if (value % 100 !== 0) return "Điểm phải là bội số 100";
  return "";
}

export function generateSmartTicks(min: number, max: number): number[] {
  if (max - min <= 0) return [min];
  
  if (max <= 500) {
    return Array.from(
      { length: Math.min(max - min + 1, 6) }, 
      (_, i) => min + i * Math.floor((max - min) / 5)
    );
  }
  
  const roundTicks = [100, 200, 300, 400, 500, 1000, 1500, 2000, 2500, 3000, 5000, 10000];
  const ticks = [min];
  
  roundTicks.forEach(val => {
    if (val > min && val < max) ticks.push(val);
  });
  
  if (max !== min) ticks.push(max);
  
  return Array.from(new Set(ticks)).sort((a, b) => a - b);
}

export function calculateThumbPosition(value: number, ticks: number[]): number {
  const idx = ticks.findIndex((t) => t === value);
  
  if (idx === -1) {
    const min = ticks[0];
    const max = ticks[ticks.length - 1];
    return ((value - min) / (max - min)) * 100;
  }
  
  if (ticks.length === 1) return 0;
  return (idx / (ticks.length - 1)) * 100;
}
