import { useParams } from "react-router-dom";
import { useEmployeeProfile } from "../../hooks/useEmployeeProfile";
import { useSecureFieldToggle } from "../../hooks/useSecureFieldToggle";
import { useUpdateEmployeeInfo } from "../../hooks/useUpdateEmployeeInfo";
import type { UpdateEmployeeFormData } from "../../hooks/useUpdateEmployeeInfo";
import ProfileLayout from "../../layouts/ProfileLayout";
import ManagerProfileLayout from "../../layouts/ManagerProfileLayout";
import ProfileContent from "../../components/profile/ProfileContent";
import ProfileSkeleton from "../../components/profile/ProfileSkeleton";
import UpdateEmployeePersonalInformation from "../../components/profile/UpdateProfileEmployee";
import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const { id } = useParams();
  const { data, loading, err, refetch } = useEmployeeProfile(id);
  const { toggle, isVisible } = useSecureFieldToggle();

  const roleUser = localStorage.getItem("role");
  const Layout = roleUser === "manager" ? ManagerProfileLayout : ProfileLayout;


  const { handleUpdateSubmit, isSubmitting } = useUpdateEmployeeInfo();

  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const onSubmitAndRefresh = async (formData: UpdateEmployeeFormData) => {
  await handleUpdateSubmit(formData);
  await refetch();
  setShowUpdateForm(false);
};

  // Loading state
  if (loading) {
  return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <ProfileSkeleton />
        </div>
      </Layout>
    );
  }

  // Error state
  if (err || !data) {
    return (
      <Layout>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-4 p-8 w-full"
        >
          <div className="relative">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
              }}
              transition={{ 
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <AlertCircle className="w-20 h-20 text-red-500" />
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-600">{err || "Không tìm thấy dữ liệu"}</p>
          </div>
        </motion.div>
      </Layout>
    );
  }

  // Success state
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full"
      >
        <ProfileContent
          data={data}
          showCccd={isVisible("cccd")}
          showBank={isVisible("bank")}
          showTax={isVisible("tax")}
          onToggleCccd={() => toggle("cccd")}
          onToggleBank={() => toggle("bank")}
          onToggleTax={() => toggle("tax")}
          onUpdateClick={() => setShowUpdateForm(true)}
        />
      </motion.div>

      {showUpdateForm && (
        <UpdateEmployeePersonalInformation
          employeeId={Number(data.id)}
          isOpen={showUpdateForm}
          onClose={() => setShowUpdateForm(false)}
          onSubmit={onSubmitAndRefresh}
          isSubmitting={isSubmitting}
        />
      )}
    </Layout>
  );
}
