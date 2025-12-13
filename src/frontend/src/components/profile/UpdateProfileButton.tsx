import { HiOutlinePencil } from "react-icons/hi";
import { SHADOWS } from "../../constants/styles";

interface UpdateProfileButtonProps {
  onClick?: () => void;
}

export default function UpdateProfileButton({ onClick }: UpdateProfileButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded border border-[#0066FF] bg-white text-[#0066FF] hover:bg-[#EDF4FF] transition shadow"
      style={{ boxShadow: SHADOWS.card }}
    >
      <HiOutlinePencil size={14} /> Cập nhật
    </button>
  );
}
