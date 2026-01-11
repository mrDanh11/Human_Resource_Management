/**
 * WfhPreviewTimesheet.tsx - Xem trước bảng công với các ngày WFH
 */

import { Calendar } from "lucide-react";

interface WfhPreviewTimesheetProps {
  previewDates: string[];
}

export default function WfhPreviewTimesheet({ previewDates }: WfhPreviewTimesheetProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (previewDates.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl bg-blue-600">
            <Calendar />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Xem trước bảng công</h2>
        </div>
        <p className="text-sm text-gray-600">
          Chọn ngày để xem trước
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl bg-blue-600">
          <Calendar />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Xem trước bảng công</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {previewDates.map((dateStr, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center py-2"
          >
            <div className="flex flex-col gap-1">
              <div className="text-sm text-gray-600">Ngày</div>
              <div className="text-base font-semibold text-gray-900">{formatDate(dateStr)}</div>
            </div>
            <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-medium text-sm">
              WFH
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
        Ghi chú: Các ngày sẽ được cập nhật sau khi phê duyệt
      </div>
    </div>
  );
}
