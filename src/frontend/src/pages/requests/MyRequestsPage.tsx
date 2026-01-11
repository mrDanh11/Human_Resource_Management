import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import {
  getMyRequests,
  cancelRequest,
  type RequestResponse,
  type RequestFilterParams,
  type RequestListResponse
} from "../../services/requestService";

// Components
import RequestFilters from "../../components/requests/RequestFilters";
import RequestStats from "../../components/requests/RequestStats";
import RequestTable from "../../components/requests/RequestTable";
import RequestPagination from "../../components/requests/RequestPagination";
import RequestDetailModal from "../../components/requests/RequestDetailModal";
import CancelRequestModal from "../../components/requests/CancelRequestModal";

export default function MyRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<RequestResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Modals
  const [selectedRequest, setSelectedRequest] = useState<RequestResponse | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState<RequestResponse | null>(null);

  const employeeId = parseInt(localStorage.getItem("userId") || "0");

  // Fetch requests
  const fetchRequests = useCallback(async () => {
    if (employeeId === 0) return;

    setLoading(true);
    try {
      const params: RequestFilterParams = {
        employeeId,
        pageNumber: currentPage,
        pageSize,
      };

      if (searchTerm) params.searchTerm = searchTerm;
      if (statusFilter !== "all") params.status = statusFilter as any;
      if (typeFilter !== "all") params.type = typeFilter;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const response: RequestListResponse = await getMyRequests(params);
      setRequests(response.items);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  }, [employeeId, currentPage, searchTerm, statusFilter, typeFilter, fromDate, toDate]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Auto-refresh every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRequests();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchRequests();
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const handleViewDetail = (request: RequestResponse) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleCancelClick = (request: RequestResponse) => {
    setRequestToCancel(request);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async (reason: string) => {
    if (!requestToCancel) return;

    try {
      await cancelRequest(requestToCancel.id, reason);
      setShowCancelModal(false);
      setRequestToCancel(null);
      fetchRequests(); // Refresh list
    } catch (error) {
      console.error("Error canceling request:", error);
      alert("Không thể hủy yêu cầu. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">Yêu cầu của tôi</h1>
            <p className="mt-2 text-sm text-gray-600">
              Xem lại lịch sử các yêu cầu đã gửi và theo dõi trạng thái phê duyệt
            </p>
          </div>
          <button
            onClick={() => navigate("/requests/create")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <Plus size={18} />
            Tạo mới yêu cầu
          </button>
        </div>

        {/* Filters */}
        <RequestFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          fromDate={fromDate}
          toDate={toDate}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
          onTypeChange={setTypeFilter}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onSearch={handleSearch}
          onReset={handleResetFilters}
        />

        {/* Stats Summary */}
        <RequestStats totalCount={totalCount} requests={requests} />

        {/* Request List */}
        <RequestTable
          requests={requests}
          loading={loading}
          onViewDetail={handleViewDetail}
          onCancel={handleCancelClick}
        />

        {/* Pagination */}
        {!loading && requests.length > 0 && (
          <RequestPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Modals */}
      {showDetailModal && selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedRequest(null);
          }}
        />
      )}

      {showCancelModal && requestToCancel && (
        <CancelRequestModal
          request={requestToCancel}
          onCancel={() => {
            setShowCancelModal(false);
            setRequestToCancel(null);
          }}
          onConfirm={handleCancelConfirm}
        />
      )}
    </div>
  );
}
