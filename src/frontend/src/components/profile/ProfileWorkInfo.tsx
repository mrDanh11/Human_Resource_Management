import { HiOutlineCalendar } from "react-icons/hi";
import InfoGrid from "./InfoGrid";
import Field from "./Field";
import { formatDateVN } from "../../utils/dateFormatter";

interface ProfileWorkInfoProps {
  department?: string;
  position?: string;
  joinDate?: string | Date;
  birthDate?: string | Date;
}

export default function ProfileWorkInfo({
  department,
  position,
  joinDate,
  birthDate,
}: ProfileWorkInfoProps) {
  return (
    <InfoGrid cols={2}>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-gray-600">Phòng ban</div>
        <div className="text-base font-semibold text-gray-900">{department || "-"}</div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-gray-600">Chức vụ</div>
        <div className="text-base font-semibold text-gray-900">{position || "-"}</div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <HiOutlineCalendar className="w-4 h-4" />
          <span>Ngày vào làm</span>
        </div>
        <div className="text-base font-semibold text-gray-900">{formatDateVN(joinDate)}</div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <HiOutlineCalendar className="w-4 h-4" />
          <span>Ngày sinh</span>
        </div>
        <div className="text-base font-semibold text-gray-900">{formatDateVN(birthDate)}</div>
      </div>
    </InfoGrid>
  );
}
