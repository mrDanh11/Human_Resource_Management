import FormField from './FormField';

interface DateRangeInputProps {
  startDate: string;
  endDate: string;
  startError?: string;
  endError?: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onBlur: (field: string) => void;
}

export default function DateRangeInput({
  startDate,
  endDate,
  startError,
  endError,
  onStartChange,
  onEndChange,
  onBlur,
}: DateRangeInputProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField label="Ngày bắt đầu" required error={startError}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          onBlur={() => onBlur('startDate')}
          className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#535bf2] focus:border-[#535bf2] bg-white font-['Open_Sans']"
        />
      </FormField>

      <FormField label="Ngày kết thúc" required error={endError}>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          onBlur={() => onBlur('endDate')}
          className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#535bf2] focus:border-[#535bf2] bg-white font-['Open_Sans']"
        />
      </FormField>
    </div>
  );
}
