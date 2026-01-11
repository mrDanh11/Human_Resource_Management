/**
 * RequestList.tsx - Trang danh sách yêu cầu
 * Employee: yêu cầu của mình, Manager: yêu cầu cần approve
 * Filter by status, type, date range
 */

// Filter controls (status, type, date)
// Request cards với actions
// Bulk approve functionality (manager)
// Create new request button
// Stats summary (pending, approved, rejected)

import { useEffect, useMemo, useState } from 'react';
import { Search, FileClock, Eye } from 'lucide-react';
import LeaveRequestDetail from '../../components/requests/RequestOnLeaveDetail';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchRequestsList } from '../../store/requestSlice';

const LeaveRequestPage = () => {
    const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState('pending');
    const [sortOrder, setSortOrder] = useState('Newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const selectType = 'leave';

    const dispatch = useAppDispatch();
    const { requestsList, loading, error } = useAppSelector((state) => state.requests);
    
    useEffect(() => {
        // Dispatch action to fetch requests list
        dispatch(fetchRequestsList({ page: currentPage, size: 10 }));
    }, [dispatch, currentPage]);
        
    const filteredRequests = useMemo(() => {
        if (!requestsList) return [];

        return requestsList.filter(request => {
            const searchMatch = !searchTerm || request.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
            if (!searchMatch) return false;
            const statusMatch = selectedStatus === 'All' || request.status === selectedStatus;
            const typeMatch = request.type === selectType;
            return statusMatch && typeMatch && searchMatch;
        }).sort((a, b) => {
            const dateA = new Date(a.createdDate).getTime();
            const dateB = new Date(b.createdDate).getTime();
            return sortOrder === 'Newest' ? dateB - dateA : dateA - dateB;
        });
    }, [requestsList, selectedStatus, searchTerm, sortOrder, selectType]);

    const itemsPerPage = 5;
    const totalFilteredPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const currentRequests = filteredRequests.slice(startIdx, endIdx);

    // Reset về trang 1 khi filter thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedStatus, selectType, sortOrder]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + currentRequests.length;

    const handleViewDetail = (requestId: number) => {
        setSelectedRequest(requestId);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedRequest(null);
    };

    const getTypeDisplay = (type: string) => {
        const typeMap: Record<string, { label: string; badge: string }> = {
            leave: { label: 'Nghỉ phép', badge: 'blue' },
            // wfh: { label: 'Làm từ xa', badge: 'purple' },
            // checkin: { label: 'Check-in', badge: 'green' },
            // checkout: { label: 'Check-out', badge: 'orange' }
        };
        return typeMap[type] || { label: type, badge: 'gray' };
    };

    const getStatusDisplay = (status: string) => {
        const statusMap: Record<string, { label: string; color: string }> = {
            pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700' },
            approved: { label: 'Đã phê duyệt', color: 'bg-green-100 text-green-700' },
            rejected: { label: 'Đã từ chối', color: 'bg-red-100 text-red-700' }
        };
        return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
    };

    const getBadgeColor = (badge: string) => {
        const colors: Record<string, string> = {
            blue: 'bg-blue-100 text-blue-700',
            purple: 'bg-purple-100 text-purple-700',
            orange: 'bg-orange-100 text-orange-700',
            green: 'bg-green-100 text-green-700',
            gray: 'bg-gray-100 text-gray-700'
        };
        return colors[badge] || 'bg-gray-100 text-gray-700';
    };

    const formatDate = (dateString: string) => {
        try {
            const normalized = dateString.split(".")[0];
            const date = new Date(normalized);
            return date.toLocaleDateString('vi-VN', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
            });
        } catch {
            return dateString;
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalFilteredPages) {
            setCurrentPage(page);
        }
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalFilteredPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 rounded ${
                        currentPage === i
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                >
                    {i}
                </button>
            );
        }
        
        return buttons;
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FileClock className="w-6 h-6" /> 
                        Yêu cầu nghỉ phép
                    </h1>
                </div>

                {/* Search and Filters */}
                <div className="bg-white px-6 py-4 border-b">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">Tìm kiếm</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên nhân viên..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">Trạng thái</label>
                            <select 
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="pending">Chờ duyệt</option>
                                <option value="All">Tất cả trạng thái</option>
                                <option value="approved">Đã phê duyệt</option>
                                <option value="rejected">Đã từ chối</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">Sắp xếp theo</label>
                            <select 
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Newest">Mới nhất</option>
                                <option value="Oldest">Cũ nhất</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white shadow-md rounded-b-lg overflow-hidden">
                    {loading ? (
                        <div className="px-6 py-12 text-center text-gray-500">
                            Đang tải dữ liệu...
                        </div>
                    ) : error ? (
                        <div className="px-6 py-12 text-center text-red-500">
                            Có lỗi xảy ra: {error}
                        </div>
                    ) : currentRequests.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-500">
                            Không có yêu cầu nào
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto p-4">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nhân viên
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Loại yêu cầu
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ngày tạo
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Trạng thái
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentRequests.map((request) => {
                                            const typeInfo = getTypeDisplay(request.type);
                                            const statusInfo = getStatusDisplay(request.status);
                                            
                                            return (
                                                <tr key={request.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                                {request.employeeName.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="ml-3">
                                                                <div className="font-medium text-gray-900">{request.employeeName}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(typeInfo.badge)}`}>
                                                            {typeInfo.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {formatDate(request.createdDate)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${statusInfo.color}`}>
                                                            {statusInfo.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleViewDetail(request.id)}
                                                                className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                                            >
                                                                <Eye className="w-4 h-4 mr-1" />
                                                                Xem chi tiết
                                                            </button>
                                                            {request.status === 'pending' && (
                                                                <>
                                                                    <button className="inline-flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                                                                        Duyệt
                                                                    </button>
                                                                    <button className="inline-flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                                                                        Từ chối
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
                                <div className="text-sm text-gray-700">
                                    Hiển thị <span className="font-medium">{startIndex + 1}-{endIndex}</span> trong số <span className="font-medium">{filteredRequests.length}</span> yêu cầu
                                </div>
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ‹
                                    </button>
                                    {renderPaginationButtons()}
                                    <button 
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalFilteredPages}
                                        className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ›
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal Chi tiết */}
            {isDetailModalOpen && selectedRequest && (
                <LeaveRequestDetail
                    requestId={selectedRequest}
                    isOpen={isDetailModalOpen}
                    onClose={handleCloseDetailModal}
                />
            )}
        </div>
    );
};

export default LeaveRequestPage;