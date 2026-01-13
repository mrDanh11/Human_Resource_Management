import { HiOutlineOfficeBuilding, HiOutlineLockClosed } from "react-icons/hi";
import { BACKGROUNDS } from "../../types/styles";
import Card from "./ProfileCard";
import ProfileBasicInfo from "./ProfileBasicInfo";
import ProfileWorkInfo from "./ProfileWorkInfo";
import ProfileSecurityInfo from "./ProfileSecurityInfo";

interface EmployeeData2 {
  id?: number;
  fullname?: string;
  email?: string;
  phone?: string;
  address?: string;
  cccd?: string;
  taxCode?: string;
  bankAccount?: string;
  departmentName?: string;
  roleName?: string;
  birthday?: string;
  position?: string;
  joinDate?: string | Date;
  birthDate?: string | Date;
}

interface ProfileContentProps {
  data: EmployeeData2;
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
    <div className="flex-1 p-6 w-full" style={BACKGROUNDS.page}>
      <div className="mx-auto" style={BACKGROUNDS.page}>
        {/* CARD 1: Thông tin cơ bản */}
        <Card
          title=""
          iconColor="#3b82f6"
          hideHeader={true}
        >
          <ProfileBasicInfo data={data} onUpdateClick={onUpdateClick} />
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* CARD 2: Công việc */}
          <Card 
            title="Công việc" 
            icon={<HiOutlineOfficeBuilding />}
            iconColor="#10b981"
          >
            <ProfileWorkInfo
              department={data.departmentName}
              position={data.roleName}
              joinDate={data.joinDate}
              birthDate={data.birthday}
            />
          </Card>

          {/* CARD 3: Bảo mật */}
          <Card 
            title="Cá nhân & Bảo mật" 
            icon={<HiOutlineLockClosed />}
            iconColor="#f97316"
          >
            <ProfileSecurityInfo
              data={data}
              showCccd={showCccd}
              showBank={showBank}
              showTax={showTax}
              onToggleCccd={onToggleCccd}
              onToggleBank={onToggleBank}
              onToggleTax={onToggleTax}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
