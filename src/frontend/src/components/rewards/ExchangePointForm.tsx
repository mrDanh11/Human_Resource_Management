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

  const [points, setPoints] = useState("100");
  const [error, setError] = useState("");

  const money = () => (Number(points) / 100) * rate;

  const formatCurrency = (v: number) =>
    v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const handleInput = (value: string) => {
    setPoints(value);
    setError("");

    const num = Number(value);

    if (!value) return;
    if (isNaN(num)) return setError("Vui lòng nhập số hợp lệ.");
    if (num < MIN) return setError(`Tối thiểu: ${MIN}`);
    if (num > current) return setError("Vượt quá điểm hiện có.");
    if (num % STEP !== 0) return setError(`Bội số hợp lệ: ${STEP}`);
  };

  return (
    <div className="bg-white rounded-md">
      <label className="text-sm font-medium block mb-2">Số điểm muốn quy đổi</label>

      <input
        value={points}
        onChange={(e) => handleInput(e.target.value)}
        className="w-full border-2 p-3 rounded-md text-base mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ borderColor: THEME_COLORS.primary[400] }}
      />

      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <p>Tối thiểu: 100</p>
        <p>Tối đa: {current}</p>
      </div>

      <div className="mt-3 p-3 rounded-md flex justify-between items-center bg-green-100 border-2 border-green-300">
        <span className="text-green-700 font-medium text-sm">Số tiền nhận:</span>
        <span className="font-bold text-green-700 text-lg">{formatCurrency(money())}</span>
      </div>

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

      <button
        className="w-full mt-4 p-3 text-white rounded-lg text-base font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: THEME_COLORS.primary[600] }}
        onClick={() => openConfirm(Number(points), money())}
        disabled={!!error}
      >
        Quy đổi ngay
      </button>
    </div>
  );
}
