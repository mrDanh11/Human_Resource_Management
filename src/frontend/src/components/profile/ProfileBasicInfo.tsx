import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import UpdateProfileButton from "./UpdateProfileButton";

interface ProfileBasicInfoProps {
  data: {
    fullName?: string;
    employeeCode?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  onUpdateClick?: () => void;
}

export default function ProfileBasicInfo({
  data,
  onUpdateClick,
}: ProfileBasicInfoProps) {
  return (
    <div className="flex flex-col gap-0">
      {/* HEADER với Avatar, Tên, Mã NV, Email, NÚt Cập nhật */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center text-white text-3xl shadow-md relative">
            <HiOutlineUser />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xl font-bold text-gray-900">
              {data.fullName || "Không có tên"}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <HiOutlineUser className="w-4 h-4 text-blue-600" />
                <span>{data.employeeCode || "-"}</span>
              </div>
              <div className="flex items-center gap-1">
                <HiOutlineMail className="w-4 h-4 text-blue-600" />
                <span>{data.email || "-"}</span>
              </div>
            </div>
          </div>
        </div>
        {onUpdateClick && <UpdateProfileButton onClick={onUpdateClick} />}
      </div>

      {/* Thông tin liên hệ */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HiOutlinePhone className="w-4 h-4 text-blue-600" />
            <span>Số điện thoại</span>
          </div>
          <div className="text-base font-semibold text-gray-900">
            {data.phone || "-"}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HiOutlineLocationMarker className="w-4 h-4 text-blue-600" />
            <span>Địa chỉ</span>
          </div>
          <div className="text-base font-semibold text-gray-900">
            {data.address || "-"}
          </div>
        </div>
      </div>
    </div>
  );
}
