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
    <div className="flex-1 p-6 w-full relative" style={BACKGROUNDS.page}>
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-10 pointer-events-none" />
      
      <div className="mx-auto relative z-10">
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
