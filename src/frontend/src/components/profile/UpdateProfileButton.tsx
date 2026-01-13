import { HiOutlinePencil } from "react-icons/hi";
import { SHADOWS } from "../../types/styles";

interface UpdateProfileButtonProps {
  onClick?: () => void;
}

export default function UpdateProfileButton({ onClick }: UpdateProfileButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-5 py-2.5 text-base font-semibold rounded-lg border-2 border-[#0066FF] bg-white text-[#0066FF] hover:bg-[#0066FF] hover:text-white transition-all duration-200 shadow-md"
      style={{ 
        boxShadow: SHADOWS.card,
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 5px 20px rgba(0, 102, 255, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = SHADOWS.card;
      }}
    >
      <HiOutlinePencil size={18} /> Cập nhật
    </button>
  );
}
