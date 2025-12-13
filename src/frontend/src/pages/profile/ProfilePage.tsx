import { useParams } from "react-router-dom";
import { useEmployeeProfile } from "../../hooks/useEmployeeProfile";
import { useSecureFieldToggle } from "../../hooks/useSecureFieldToggle";
import ProfileLayout from "../../layouts/ProfileLayout";
import ProfileContent from "../../components/profile/ProfileContent";
import ProfileSkeleton from "../../components/profile/ProfileSkeleton";

export default function ProfilePage() {
  const { id } = useParams();
  const { data, loading, err } = useEmployeeProfile(id);
  const { toggle, isVisible } = useSecureFieldToggle();

  // Loading state
  if (loading) {
    return (
      <ProfileLayout>
        <div className="flex-1 flex items-center justify-center">
          <ProfileSkeleton />
        </div>
      </ProfileLayout>
    );
  }

  // Error state
  if (err || !data) {
    return (
      <ProfileLayout>
        <div className="flex-1 flex items-center justify-center">
          {err || "Không tìm thấy dữ liệu"}
        </div>
      </ProfileLayout>
    );
  }

  // Success state
  return (
    <ProfileLayout>
      <ProfileContent
        data={data}
        showCccd={isVisible("cccd")}
        showBank={isVisible("bank")}
        showTax={isVisible("tax")}
        onToggleCccd={() => toggle("cccd")}
        onToggleBank={() => toggle("bank")}
        onToggleTax={() => toggle("tax")}
        onUpdateClick={() => console.log("Update profile clicked")}
      />
    </ProfileLayout>
  );
}
