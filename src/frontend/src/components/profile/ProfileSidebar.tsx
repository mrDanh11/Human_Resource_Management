// Sidebar hồ sơ
import Avatar from "../../components/common/Avatar";
import { HiOutlineCheckCircle, HiOutlinePencil } from "react-icons/hi";
import { THEME_COLORS } from "../../components/common/THEME_COLORS";
import { useState } from "react";
import UpdateEmployeeInformation from "./ProfileForm";
import { fetchEmployees, updateEmployeeWorkingInfo } from "../../store/employeeSlice";
import { useAppDispatch } from "../../store/hooks";

export default function ProfileSidebar({ data }: any) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();

  // Xử lý submit cập nhật thông tin làm việc
  const handleUpdateSubmit = async (data: { employeeId: number; fullname: string; departmentId: number; status: string; phone: string; email: string; address: string; bankAccount: string; birthday: string; gender: string }) => {
    if (!data.employeeId) return;

    setIsSubmitting(true);
    try {
      await dispatch(updateEmployeeWorkingInfo({
        id: data.employeeId,
        data: {
          fullname: data.fullname,
          status: data.status,
          departmentId: data.departmentId,
          phone: data.phone,
          email: data.email,
          address: data.address,
          bankAccount: data.bankAccount,
          birthday: data.birthday,
          gender: data.gender,
        }
      })).unwrap();

      // Refresh danh sách nhân viên sau khi cập nhật thành công
      dispatch(fetchEmployees({
        pageNumber: 1,
        pageSize: 1000,
      }));
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin nhân viên:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <aside
        className="w-[320px] rounded-xl border bg-white p-6 shadow-sm flex flex-col items-center gap-5"
        style={{ borderColor: THEME_COLORS.primary[500] }}
      >
        <Avatar src={data.avatar} name={data.fullName} size="xl" />

        <div className="text-center">
          <h2 className="text-xl font-semibold" style={{ color: THEME_COLORS.primary[700] }}>
            {data.fullName}
          </h2>
          <p className="text-sm mt-1 text-gray-600">{data.position || "-"}</p>
          <p className="text-xs text-gray-500">{data.department || "-"}</p>
        </div>

        <div
          className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-medium border"
          style={{
            background: THEME_COLORS.primary[50],
            color: THEME_COLORS.primary[600],
            borderColor: THEME_COLORS.primary[300],
          }}
        >
          <HiOutlineCheckCircle size={16} />
          Đang làm việc
        </div>

        <button
          onClick={() => setIsUpdateModalOpen(true)}
          className="mt-3 px-4 py-2 w-full rounded-lg text-sm font-medium flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <HiOutlinePencil size={16} /> Chỉnh sửa hồ sơ
        </button>
      </aside>

      <UpdateEmployeeInformation
        employeeId={data.id}
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
