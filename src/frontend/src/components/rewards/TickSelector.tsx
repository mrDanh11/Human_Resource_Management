import { useEffect, useState } from "react";
import { calculateMoneyFromPoints, validatePointValue } from "../../utils/pointCalculations";
import PointSlider from "./PointSlider";
import PointInputField from "./PointInputField";
import MoneyDisplay from "./MoneyDisplay";

interface TickSelectorProps {
  max: number;
  rate: number;
  onSelect: (points: number, money: number) => void;
  onChangePercent: (percent: number) => void;
}

export default function TickSelector({ 
  max, 
  rate, 
  onSelect, 
  onChangePercent 
}: TickSelectorProps) {
  const [value, setValue] = useState(100);
  const [input, setInput] = useState("100");
  const [error, setError] = useState("");

  useEffect(() => {
    onChangePercent((value / max) * 100);
  }, [value, max, onChangePercent]);

  const money = calculateMoneyFromPoints(value, rate);

  const handleApply = (v: number): void => {
    const err = validatePointValue(v, max);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setValue(v);
    setInput(String(v));
  };

  const handleSliderChange = (v: number): void => {
    handleApply(v);
  };

  const handleInputBlur = (): void => {
    handleApply(Number(input));
  };

  const handleExchange = (): void => {
    onSelect(value, money);
  };

  return (
    <div className="w-full">
      <PointSlider
        min={100}
        max={max}
        value={value}
        onChange={handleSliderChange}
      />

      <PointInputField
        value={input}
        onChange={setInput}
        onBlur={handleInputBlur}
        error={error}
        max={max}
      />

      <MoneyDisplay money={money} />

      <button
        className="w-full mt-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
        onClick={handleExchange}
      >
        <span className="text-xl">💰</span>
        <span>Quy đổi ngay</span>
      </button>
    </div>
  );
}
