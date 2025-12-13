import { useState } from "react";
import { THEME_COLORS } from "../common/THEME_COLORS";

export default function ExchangePointForm({
  current,
  rate,
  openConfirm,
}: {
  current: number;
  rate: number;
  openConfirm: (points: number, money: number) => void;
}) {
  const MIN = 100;
  const STEP = 100;

  const [points, setPoints] = useState(100);
  const [error, setError] = useState("");

  const money = () => (points / 100) * rate;

  const validate = (val: number) => {
    setError("");

    if (isNaN(val)) return setError("Vui lòng nhập số hợp lệ.");
    if (val < MIN) return setError(`Tối thiểu: ${MIN}`);
    if (val > current) return setError("Vượt quá điểm hiện có.");
    if (val % STEP !== 0) return setError(`Điểm phải là bội số của ${STEP}`);
  };

  const applyValue = (val: number) => {
    setPoints(val);
    validate(val);
  };

  return (
    <div className="bg-white rounded-xl">

      {/* LABEL */}
      <label className="text-sm font-medium block mb-2">Số điểm muốn quy đổi</label>

      {/* QUICK SELECT BUTTONS */}
      <div className="flex gap-3 mb-3">
        {[100, 200, 500, current].map((p) => (
          <button
            key={p}
            onClick={() => applyValue(p)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition 
              ${
                points === p
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-blue-300 text-blue-700 hover:bg-blue-100"
              }`}
          >
            {p === current ? "Max" : p}
          </button>
        ))}
      </div>

      {/* SLIDER */}
      <input
        type="range"
        min={MIN}
        max={current}
        step={STEP}
        value={points}
        onChange={(e) => applyValue(Number(e.target.value))}
        className="w-full accent-blue-600 my-2"
      />

      {/* TEXT INPUT */}
      <input
        value={points}
        onChange={(e) => applyValue(Number(e.target.value))}
        className="w-full border-2 p-3 rounded-md text-base mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ borderColor: THEME_COLORS.primary[400] }}
      />

      {/* MIN/MAX INDICATOR */}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <p>Tối thiểu: {MIN}</p>
        <p>Tối đa: {current}</p>
      </div>

      {/* MONEY PREVIEW */}
      <div className="mt-3 p-3 rounded-md flex justify-between items-center bg-green-100 border-2 border-green-300">
        <span className="text-green-700 font-medium text-sm">Số tiền nhận:</span>
        <span className="font-bold text-green-700 text-lg">
          {money().toLocaleString("vi-VN")} đ
        </span>
      </div>

      {/* ERROR */}
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

      {/* CONFIRM BUTTON */}
      <button
        className="w-full mt-4 p-3 text-white rounded-lg text-base font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: THEME_COLORS.primary[600] }}
        onClick={() => openConfirm(points, money())}
        disabled={!!error}
      >
        Quy đổi ngay
      </button>
    </div>
  );
}
