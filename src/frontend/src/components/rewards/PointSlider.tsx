import { useEffect, useState } from "react";
import { generateSmartTicks, calculateThumbPosition } from "../../utils/pointCalculations";

interface PointSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

export default function PointSlider({ min, max, value, onChange }: PointSliderProps) {
  const [dragging, setDragging] = useState(false);
  const ticks = generateSmartTicks(min, max);
  const percentPos = calculateThumbPosition(value, ticks);

  const handleDrag = (clientX: number): void => {
    const track = document.getElementById("tick-track");
    if (!track) return;
    
    const rect = track.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percent = x / rect.width;
    
    const idx = Math.round(percent * (ticks.length - 1));
    const snapped = ticks[idx];
    onChange(snapped);
  };

  const handleThumbMouseDown = (e: React.MouseEvent | React.TouchEvent): void => {
    e.preventDefault();
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    
    const onMove = (e: MouseEvent | TouchEvent): void => {
      handleDrag((e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX);
    };
    
    const onUp = () => setDragging(false);
    
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging]);

  const handleTrackClick = (e: React.MouseEvent | React.TouchEvent): void => {
    handleDrag((e as React.TouchEvent).touches ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX);
  };

  return (
    <>
      <div
        id="tick-track"
        className="relative w-full mt-6 mb-4 h-4 flex items-center select-none"
        onMouseDown={handleTrackClick}
        onTouchStart={handleTrackClick}
        style={{ cursor: "pointer" }}
      >
        <div className="absolute left-0 right-0 h-2 bg-gray-300 rounded-full"></div>
        
        <div
          className="absolute h-2 bg-blue-600 rounded-full"
          style={{
            width: `${percentPos}%`,
            transition: "width 0.25s ease",
          }}
        ></div>
        
        <div
          className="absolute w-6 h-6 bg-blue-600 rounded-full shadow cursor-pointer"
          style={{
            left: `calc(${percentPos}% - 12px)`,
            transition: "left 0.25s ease",
            zIndex: 2,
          }}
          onMouseDown={handleThumbMouseDown}
          onTouchStart={handleThumbMouseDown}
        ></div>
      </div>

      <div className="w-full flex justify-between px-1">
        {ticks.map((p) => (
          <div
            key={p}
            className="flex flex-col items-center cursor-pointer select-none"
            onClick={() => onChange(p)}
          >
            <div
              className="w-1 h-3 rounded-full mb-1"
              style={{
                background: p === value ? "#1d4ed8" : "#b6bcc9",
              }}
            ></div>
            
            <span
              className={`text-sm ${
                p === value ? "text-blue-600 font-semibold" : "text-gray-700"
              }`}
            >
              {p}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
