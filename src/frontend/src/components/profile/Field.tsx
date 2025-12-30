// Row thông tin thường
import React from "react";

export default function Field({ label, icon, children }: any) {
  return (
    <div className="flex flex-col items-start text-left gap-2">
      <div className="flex items-center gap-2 text-base text-gray-600 font-medium">
        {icon && React.cloneElement(icon, { className: "w-5 h-5 text-blue-600" })}
        {label}
      </div>

      <div className="text-lg font-semibold text-gray-900">
        {children || "-"}
      </div>
    </div>
  );
}
