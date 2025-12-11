import { HiOutlineUser, HiOutlineOfficeBuilding } from "react-icons/hi";
import { BACKGROUNDS } from "../../constants/styles";
import Card from "./ProfileCard";
import ProfileBasicInfo from "./ProfileBasicInfo";
import ProfileWorkInfo from "./ProfileWorkInfo";
import UpdateProfileButton from "./UpdateProfileButton";

interface EmployeeData {
  fullName?: string;
  employeeCode?: string;
  email?: string;
  phone?: string;
  address?: string;
  citizenId?: string;
  taxCode?: string;
  bankAccount?: {
    accountNumber?: string;
  };
  department?: string;
  position?: string;
  joinDate?: string | Date;
  birthDate?: string | Date;
}

interface ProfileContentProps {
  data: EmployeeData;
  showCccd: boolean;
  showBank: boolean;
  showTax: boolean;
  onToggleCccd: () => void;
  onToggleBank: () => void;
  onToggleTax: () => void;
  onUpdateClick?: () => void;
}

export default function ProfileContent({
  data,
  showCccd,
  showBank,
  showTax,
  onToggleCccd,
  onToggleBank,
  onToggleTax,
  onUpdateClick,
}: ProfileContentProps) {
  return (
    <div className="flex-1 p-6 flex justify-center" style={BACKGROUNDS.page}>
      <div className="w-full max-w-5xl flex flex-col gap-6" style={BACKGROUNDS.page}>
        {/* CARD 1: Thông tin cơ bản */}
        <Card
          title="Thông tin cơ bản"
          icon={<HiOutlineUser />}
          right={<UpdateProfileButton onClick={onUpdateClick} />}
        >
          <ProfileBasicInfo
            data={data}
            showCccd={showCccd}
            showBank={showBank}
            showTax={showTax}
            onToggleCccd={onToggleCccd}
            onToggleBank={onToggleBank}
            onToggleTax={onToggleTax}
          />
        </Card>

        {/* CARD 2: Công việc */}
        <Card title="Công việc" icon={<HiOutlineOfficeBuilding />}>
          <ProfileWorkInfo
            department={data.department}
            position={data.position}
            joinDate={data.joinDate}
            birthDate={data.birthDate}
          />
        </Card>
      </div>
    </div>
  );
}
