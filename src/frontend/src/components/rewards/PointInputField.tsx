interface PointInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  max: number;
}

export default function PointInputField({ 
  value, 
  onChange, 
  onBlur, 
  error, 
  max 
}: PointInputFieldProps) {
  return (
    <div className="mt-6">
      <label className="text-sm font-bold text-gray-700 mb-3 block">💳 Nhập số điểm muốn đổi</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        onBlur={onBlur}
        className="w-full border-2 border-gray-200 rounded-xl p-4 mt-2 text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gradient-to-r from-blue-50/50 to-purple-50/50"
        placeholder="Nhập số điểm (bội số 100)"
        min={100}
        max={max}
        step={100}
        inputMode="numeric"
        pattern="[0-9]*"
      />
      {error && (
        <div className="mt-2 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-semibold flex items-center gap-2">
            <span>⚠️</span>
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
