import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { updateEmployeePersonalInfo, fetchEmployeeDetail } from "../store/employeeSlice";

interface UpdateEmployeeFormData {
  employeeId: number;
  fullname: string;
  phone: string;
  email: string;
  birthday: string;
  address: string;
  gender: string;
}

export function useUpdateEmployeeInfo() {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateSubmit = async (data: UpdateEmployeeFormData): Promise<void> => {
    if (!data.employeeId) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        updateEmployeePersonalInfo({
          id: data.employeeId,
          data: {
            fullname: data.fullname,
            phone: data.phone,
            email: data.email,
            birthday: data.birthday,
            address: data.address,
            gender: data.gender,
          },
        })
      ).unwrap();

    // Sau khi cập nhật thành công, có thể fetch lại chi tiết nhân viên nếu cần
    await dispatch(fetchEmployeeDetail(data.employeeId)).unwrap();

    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin nhân viên:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleUpdateSubmit,
    isSubmitting,
  };
}
