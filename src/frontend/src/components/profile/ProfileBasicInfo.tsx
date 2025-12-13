import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineLockClosed,
} from "react-icons/hi";
import InfoGrid from "./InfoGrid";
import Field from "./Field";
import SecureRow from "./SecureField";

interface ProfileBasicInfoProps {
  data: {
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
  };
  showCccd: boolean;
  showBank: boolean;
  showTax: boolean;
  onToggleCccd: () => void;
  onToggleBank: () => void;
  onToggleTax: () => void;
}

export default function ProfileBasicInfo({
  data,
  showCccd,
  showBank,
  showTax,
  onToggleCccd,
  onToggleBank,
  onToggleTax,
}: ProfileBasicInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative pt-6 pb-2">
      {/* LINE DIVIDER */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 border-l border-[#E6E6E6]"></div>
      
      {/* LEFT */}
      <div className="flex flex-col gap-4 pr-6 pb-2">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 text-4xl bg-gray-50">
            <HiOutlineUser />
          </div>
          <div className="font-semibold">
            {data.fullName || "Không có tên"}
          </div>
        </div>
        <hr className="border-[#E6E6E6]" />
        <InfoGrid cols={2} className="pb-2">
          <Field label="Mã nhân viên">{data.employeeCode || "-"}</Field>
          <Field label="Email" icon={<HiOutlineMail />}>
            {data.email}
          </Field>
          <Field label="Số điện thoại" icon={<HiOutlinePhone />}>
            {data.phone}
          </Field>
          <Field label="Địa chỉ" icon={<HiOutlineLocationMarker />}>
            {data.address}
          </Field>
        </InfoGrid>
      </div>
      
      {/* RIGHT */}
      <div className="flex flex-col gap-4 pl-6 pb-2">
        <h3 className="font-medium flex items-center gap-2">
          <HiOutlineLockClosed /> Bảo mật
        </h3>
        <InfoGrid cols={1} className="pb-1">
          <SecureRow
            label="Số CCCD"
            value={data.citizenId}
            show={showCccd}
            onToggle={onToggleCccd}
          />
          {data.bankAccount && (
            <SecureRow
              label="Tài khoản ngân hàng"
              value={data.bankAccount.accountNumber}
              show={showBank}
              onToggle={onToggleBank}
            />
          )}
          <SecureRow
            label="Mã số thuế"
            value={data.taxCode}
            show={showTax}
            onToggle={onToggleTax}
          />
        </InfoGrid>
      </div>
    </div>
  );
}
