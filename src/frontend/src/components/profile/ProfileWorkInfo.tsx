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
      <Field label="Phòng ban">{department || "-"}</Field>
      <Field label="Chức vụ">{position || "-"}</Field>
      <Field label="Ngày vào làm" icon={<HiOutlineCalendar />}>
        {formatDateVN(joinDate)}
      </Field>
      <Field label="Ngày sinh" icon={<HiOutlineCalendar />}>
        {formatDateVN(birthDate)}
      </Field>
    </InfoGrid>
  );
}
