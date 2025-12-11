interface ConversionRateInfoProps {
  rate: number;
}

export default function ConversionRateInfo({ rate }: ConversionRateInfoProps) {
  return (
    <div 
      className="p-3 rounded-xl bg-white shadow border border-[#E6E6E6] flex items-center gap-2" 
      style={{ boxShadow: '0 4px 24px 0 rgba(102,178,255,0.18)' }}
    >
      <span className="text-blue-600 font-bold text-lg">ℹ️</span>
      <span className="text-sm font-medium text-gray-700">
        100 điểm = {rate.toLocaleString("vi-VN")} đ
      </span>
    </div>
  );
}
