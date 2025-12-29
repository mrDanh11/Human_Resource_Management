import SecureRow from "./SecureField";

interface ProfileSecurityInfoProps {
  data: {
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
    </div>
  );
}
