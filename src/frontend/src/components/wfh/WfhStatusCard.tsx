/**
 * WfhStatusCard.tsx - Hiển thị trạng thái yêu cầu WFH gần nhất
 */

import { useState, useEffect } from "react";

import { getEmployeeWfhRequests } from "../../services/wfhService";
import type { WfhRequest } from "../../types/wfh.types";

export default function WfhStatusCard() {
  const [latestRequest, setLatestRequest] = useState<WfhRequest | null>(null);
  const [loading, setLoading] = useState(true);

  const employeeId = parseInt(localStorage.getItem("userId") || "0");

  useEffect(() => {
    fetchLatestRequest();
  }, []);

  const fetchLatestRequest = async () => {
    try {
      const requests = await getEmployeeWfhRequests(employeeId);
      if (requests.length > 0) {
        const sorted = requests.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setLatestRequest(sorted[0]);
      }
    } catch (error) {
      console.error("Error fetching latest WFH request:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          bgColor: "bg-green-100",
          textColor: "text-green-700",
        };
      case "approved":
        return {
          label: "Đã duyệt",
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
        };
      case "rejected":
        return {
          label: "Đã từ chối",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
        };
      default:
        return {
          label: status,
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
        };
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!latestRequest) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="text-xs font-medium text-gray-500 mb-2">Trạng thái yêu cầu</div>
        <p className="text-sm text-gray-400">Chưa có yêu cầu WFH</p>
      </div>
    );
  }

  const statusConfig = getStatusConfig(latestRequest.status);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="text-xs font-medium text-gray-500 mb-3">
        Trạng thái yêu cầu
      </div>

      {/* Status Badge */}
      <div className="mb-3">
        <span
          className={`inline-block px-3 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} text-sm font-medium`}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Approver Info */}
      {latestRequest.approver && (
        <div className="text-sm">
          <span className="text-gray-600">Người duyệt: </span>
          <span className="font-semibold text-gray-900">
            {latestRequest.approver}
          </span>
        </div>
      )}
    </div>
  );
}
