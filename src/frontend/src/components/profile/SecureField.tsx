// Row thông tin nhạy cảm có ẩn/hiện
import { HiOutlineIdentification, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

const mask = (v?: string, keep = 4) => {
  if (!v) return "-";
  if (v.length <= keep) return v;
  return "*".repeat(v.length - keep) + v.slice(-keep);
};

export default function SecureRow({ label, value, show, onToggle }: any) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <HiOutlineIdentification size={16} className="text-gray-400" />
        {label}
      </div>

      <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
        <div className="text-base font-semibold font-mono text-gray-900">
          {show ? (value || "-") : mask(value)}
        </div>

        <button 
          className="text-gray-400 hover:text-gray-600 transition" 
          onClick={onToggle} 
          type="button"
        >
          {show ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
        </button>
      </div>
    </div>
  );
}
