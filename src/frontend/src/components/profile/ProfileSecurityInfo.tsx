import SecureRow from "./SecureField";

interface ProfileSecurityInfoProps {
  data: {
    cccd?: string;
    taxCode?: string;
    bankAccount?: string;
  };
  showCccd: boolean;
  showBank: boolean;
  showTax: boolean;
  onToggleCccd: () => void;
  onToggleBank: () => void;
  onToggleTax: () => void;
}

export default function ProfileSecurityInfo({
  data,
  showCccd,
  showBank,
  showTax,
  onToggleCccd,
  onToggleBank,
  onToggleTax,
}: ProfileSecurityInfoProps) {
  return (
    <div className="flex flex-col gap-4">
      <SecureRow
        label="Số CCCD"
        value={data.cccd}
        show={showCccd}
        onToggle={onToggleCccd}
      />
      {data.bankAccount && (
        <SecureRow
          label="Tài khoản ngân hàng"
          value={data.bankAccount}
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
    </div>
  );
}
