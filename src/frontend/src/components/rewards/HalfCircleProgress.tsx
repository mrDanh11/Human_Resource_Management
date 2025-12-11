import { useEffect, useState } from "react";

interface HalfCircleProgressProps {
  percent: number;
  totalPoints: number;
  totalMoney: number;
}

export default function HalfCircleProgress({ 
  percent, 
  totalPoints, 
  totalMoney 
}: HalfCircleProgressProps) {
  const size = 230;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = Math.PI * radius;

  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const target = circumference - circumference * percent;
    requestAnimationFrame(() => setOffset(target));
  }, [percent, circumference]);

  return (
    <div className="flex justify-center relative">
      <svg width={size} height={size / 1.2}>
        {/* BACK arc */}
        <path
          d={`M ${stroke / 2} ${size / 2}
              A ${radius} ${radius} 0 0 1 ${size - stroke / 2} ${size / 2}`}
          fill="none"
          stroke="#dbe0ea"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        {/* FRONT arc */}
        <path
          d={`M ${stroke / 2} ${size / 2}
              A ${radius} ${radius} 0 0 1 ${size - stroke / 2} ${size / 2}`}
          fill="none"
          stroke="#1d4ed8"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .6s ease" }}
        />
      </svg>

      {/* TEXT */}
      <div className="absolute top-[42%] text-center">
        <p className="text-blue-700 text-xl font-bold">
          {totalMoney.toLocaleString("vi-VN")} đ
        </p>
        <p className="text-gray-600 text-sm">{totalPoints} điểm</p>
      </div>
    </div>
  );
}
