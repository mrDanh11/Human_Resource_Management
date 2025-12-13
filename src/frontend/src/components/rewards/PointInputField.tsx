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
    <div className="mt-4">
      <label className="text-sm font-medium">Nhập số điểm muốn đổi</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        onBlur={onBlur}
        className="w-full border rounded-lg p-3 mt-1 text-base focus:ring-2 focus:ring-blue-300"
        placeholder="Nhập số điểm (bội số 100)"
        min={100}
        max={max}
        step={100}
        inputMode="numeric"
        pattern="[0-9]*"
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
