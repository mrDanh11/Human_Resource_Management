import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Upload, FilePenLine } from 'lucide-react';
import { createOnLeaveRequest } from '../../store/requestSlice';
import type { CreateRequestFormData, CreateLeaveRequestFormData } from '../../types/request';
import { useAppDispatch } from '../../store/hooks';
import { countAnnualLeaveUsed } from '../../store/requestSlice';

const CreateLeaveRequest = () => {
  const employee = Number(localStorage.getItem('userId'));

  const [formData, setFormData] = useState<CreateRequestFormData>({
    employeeId: employee,
    startDate: '',
    endDate: '',
    description: '',
    type: "leave",
    leaveMode: undefined,
    session: undefined,
    attachment: null
  });

  const [formData2, setFormData2] = useState<CreateLeaveRequestFormData>({
    employeeId: employee,
    startDate: '',
    endDate: '',
    description: '',
    mode: 'DAY',
    fromTime: '',
    toTime: '',
    leaveMode: 'leave',
    session: undefined,
    attachment: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');
  const [leaveSummary, setLeaveSummary] = useState<{totalAnnualLeave: number; usedAnnualLeave: number} | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
  const load = async () => {
    if (employee) {
      const leaveSummary = await dispatch(
        countAnnualLeaveUsed(employee)
      ).unwrap();

      setLeaveSummary(leaveSummary);
     }
   } ;
   load();
  }, [employee]);

  const isFormValid = useMemo(() => {
    if (!formData2.mode) return false;
    if (formData2.mode === 'DAY' && (!formData2.startDate || !formData2.endDate)) return false;
    if (formData2.mode === 'HALF_DAY' && (!formData2.startDate || !formData2.session)) return false;
    if (formData2.mode === 'SHORT_HOUR' && (!formData2.startDate || !formData2.fromTime || !formData2.toTime)) return false;
    if (formData2.mode === 'DAY' && (formData2.startDate && formData2.endDate) && (new Date(formData2.startDate) > new Date(formData2.endDate))) return false;
    if (formData2.mode === 'SHORT_HOUR' && formData2.fromTime && formData2.toTime) {
      const from = formData2.fromTime.split(':').map(Number);
      const to = formData2.toTime.split(':').map(Number);
      if (from[0] > to[0] || (from[0] === to[0] && from[1] >= to[1])) return false;
    }
    if (!formData2.description) return false;

    return true;
  }, [formData2]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFormData2({ ...formData2, attachment: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      alert('Vui lòng kiểm tra và điền đầy đủ thông tin bắt buộc.');
      return;
    }

    try {
      setIsSubmitting(true);
      await dispatch(createOnLeaveRequest(formData2)).unwrap();
      alert('Đơn xin nghỉ phép đã được gửi thành công!');
      
      setFormData2({
        employeeId: employee,
        startDate: '',
        endDate: '',
        description: '',
        mode: 'DAY',
        fromTime: '',
        toTime: '',
        leaveMode: 'leave',
        session: undefined,
        attachment: null
      });

    } catch (error) {
      alert('Đã có lỗi xảy ra khi gửi đơn xin nghỉ phép.');
    } 
  };

  const handleCancel = () => {
    setFormData2({
      employeeId: employee,
      startDate: '',
      endDate: '',
      description: '',
      mode: 'DAY',
      leaveMode: 'leave',
      session: undefined,
      attachment: null
    });
    setFileName('');
  };

  const calculateDays = () => {
    if (!formData2.startDate || !formData2.endDate) return 0;
    const start = new Date(formData2.startDate);
    const end = new Date(formData2.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form bên trái */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold text-white">
                <FilePenLine className="inline-block w-6 h-6 mr-2" />
                Yêu cầu nghỉ phép
              </h1>
              <p className="text-sm text-white mt-1">Gửi thêm yêu cầu nghỉ phép mới để quản lý phê duyệt</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin đơn xin nghỉ phép</h2>

              {/* Hình thức nghỉ */}
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình thức nghỉ <span className="text-red-500">*</span>
              </label>
              <select
                value={formData2.mode}
                onChange={(e) =>
                  setFormData2({ ...formData2, mode: e.target.value as any })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="DAY">Theo ngày</option>
                <option value="HALF_DAY">Nửa ngày</option>
                <option value="SHORT_HOUR">Theo giờ</option>
              </select>

              {/* Ngày bắt đầu và Ngày kết thúc */}
              {formData2.mode === 'DAY' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày bắt đầu <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData2.startDate}
                          onChange={(e) => setFormData2({ ...formData2, startDate: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày kết thúc <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData2.endDate}
                          onChange={(e) => setFormData2({ ...formData2, endDate: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Thời gian nghỉ
                      </label>
                      <span className="text-sm font-medium text-gray-800">{calculateDays()} ngày</span>
                    </div>
                  </div>
                </div>
              )}

              {formData2.mode === 'HALF_DAY' && (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày nghỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData2.startDate || ''}
                    onChange={(e) =>
                      setFormData2({ ...formData2, startDate: e.target.value, endDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                  />

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buổi nghỉ <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={formData2.session || ''}
                    onChange={(e) =>
                      setFormData2({ ...formData2, session: e.target.value as any })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                  >
                    <option value="">Chọn buổi</option>
                    <option value="MORNING">Buổi sáng</option>
                    <option value="AFTERNOON">Buổi chiều</option>
                  </select>
                </>
              )}
              {formData2.mode === 'SHORT_HOUR' && (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày nghỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData2.startDate}
                    onChange={e => setFormData2({ ...formData2, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Từ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData2.fromTime}
                    onChange={e => setFormData2({ ...formData2, fromTime: e.target.value })}
                    className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đến <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData2.toTime}
                    onChange={e => setFormData2({ ...formData2, toTime: e.target.value })}
                    className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </>
              )}

              {/* Loại nghỉ phép */}
              {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại nghỉ phép <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData2.leaveMode}
                  onChange={(e) => setFormData2({ ...formData2, leaveMode: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ANNUAL">Nghỉ hàng năm</option>
                  <option value="SICK">Nghỉ ốm</option>
                  <option value="UNPAID">Nghỉ không lương</option>
                  <option value="SATURDAY_OFF">Nghỉ thứ Bảy</option>
                </select>
              </div> */}

              {/* Lý do nghỉ phép */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do nghỉ phép <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData2.description}
                  onChange={(e) => setFormData2({ ...formData2, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Nhập lý do nghỉ phép..."
                />
              </div>

              {/* File đính kèm */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tải file đính kèm
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="bg-blue-100 p-3 rounded-full mb-3">
                        <Upload className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {fileName || 'Nhấn để tải lên hoặc kéo thả tệp'}
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX (tối đa 10MB)</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-red-500 text-white py-3 rounded-md font-medium hover:bg-red-600 transition-colors"
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>

          {/* Summary bên phải */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tổng quan nghỉ phép</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tổng số ngày nghỉ trong năm</span>
                  <span className="font-semibold text-gray-800">{leaveSummary?.totalAnnualLeave || 0} ngày</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Đã sử dụng</span>
                  <span className="font-semibold text-gray-800">{leaveSummary?.usedAnnualLeave || 0} ngày</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Còn lại</span>
                  <span className="font-semibold text-gray-800">{(leaveSummary?.totalAnnualLeave || 0) - (leaveSummary?.usedAnnualLeave || 0)} ngày</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(leaveSummary?.usedAnnualLeave || 0) / (leaveSummary?.totalAnnualLeave || 12) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLeaveRequest;