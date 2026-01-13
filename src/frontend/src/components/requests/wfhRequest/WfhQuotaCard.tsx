/**
 * WfhQuotaCard.tsx - Hiển thị quota WFH theo tháng
 */

import { useState, useEffect } from "react";

import { getWfhQuota } from "../../../services/wfhService";
import type { WfhQuota } from "../../../types/wfh";

export default function WfhQuotaCard() {
  const [quota, setQuota] = useState<WfhQuota | null>(null);
  const [loading, setLoading] = useState(true);

  const employeeId = parseInt(localStorage.getItem("userId") || "0");

  useEffect(() => {
    fetchQuota();
  }, []);

  const fetchQuota = async () => {
    try {
      const data = await getWfhQuota(employeeId);
      setQuota(data);
    } catch (error) {
      console.error("Error fetching WFH quota:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-indigo-600 text-white rounded-lg p-5">
        <div className="animate-pulse">
          <div className="h-4 bg-indigo-400 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-indigo-400 rounded w-1/2 mb-2"></div>
          <div className="h-2 bg-indigo-400 rounded w-full mb-3"></div>
          <div className="h-4 bg-indigo-400 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!quota) {
    return null;
  }

  const usagePercentage = (quota.usedDays / quota.monthlyLimit) * 100;

  return (
    <div className="bg-indigo-600 text-white rounded-lg p-5">
      {/* Header */}
      <div className="text-sm font-semibold mb-4">Thống kê WFH tháng này</div>

      {/* Usage Stats */}
      <div className="space-y-3">
        {/* Used Days */}
        <div>
          <div className="flex justify-between items-center mb-2 text-sm">
            <span>Đã sử dụng</span>
            <span className="font-bold">
              {quota.usedDays}/{quota.monthlyLimit} ngày
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Remaining Days */}
        <div className="pt-2 text-sm">
          <span>Còn lại:</span>
          <span className="font-bold text-lg ml-2">
            {quota.remainingDays} ngày
          </span>
        </div>
      </div>
    </div>
  );
}
