import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserGroupIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { employeeService } from '../../services/employeeService';

interface Employee {
    id: number;
    fullname: string;
    email: string;
    phone: string;
    status: string;
    joinDate: string;
    roleName: string;
    departmentName: string;
}

interface ApiResponse {
    items: Employee[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

const EmployeeList = () => {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Fetch employees from API with pagination
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const response: ApiResponse = await employeeService.getAllEmployees(pageNumber, pageSize);
                setEmployees(response.items);
                setTotalPages(response.totalPages);
                setTotalCount(response.totalCount);
            } catch (err: any) {
                setError('Không thể tải danh sách nhân viên');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, [pageNumber, pageSize]);

    // Reset về trang 1 khi filter hoặc search thay đổi
    useEffect(() => {
        setPageNumber(1);
    }, [searchTerm, selectedDepartment, selectedRole, selectedStatus]);

    // Lấy danh sách phòng ban duy nhất
    const departments = useMemo(() => {
        return Array.from(new Set(employees.map(emp => emp.departmentName).filter(Boolean)));
    }, [employees]);

    // Lấy danh sách vai trò duy nhất
    const roles = useMemo(() => {
        return Array.from(new Set(employees.map(emp => emp.roleName).filter(Boolean)));
    }, [employees]);

    // Lọc danh sách nhân viên
    const filteredEmployees = useMemo(() => {
        return employees.filter(employee => {
            const matchesSearch = employee.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  employee.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDepartment = !selectedDepartment || employee.departmentName === selectedDepartment;
            const matchesRole = !selectedRole || employee.roleName === selectedRole;
            const matchesStatus = !selectedStatus || employee.status === selectedStatus;

            return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
        });
    }, [employees, searchTerm, selectedDepartment, selectedRole, selectedStatus]);

    // Xử lý xem chi tiết
    const handleViewDetail = (employeeId: number) => {
        navigate(`/employee/list/${employeeId}`);
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-yellow-100 text-yellow-800';
            case 'terminated':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active':
                return 'Đang làm việc';
            case 'inactive':
                return 'Tạm nghỉ';
            case 'terminated':
                return 'Đã nghỉ việc';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="min-w-6xl mx-auto rounded-2xl overflow-hidden shadow-xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <UserGroupIcon className="w-8 h-8 text-white" />
                            <div className="text-2xl font-bold text-white">Quản lý Hồ sơ Nhân viên</div>
                        </div>
                        <button
                            onClick={() => navigate('/create/employee')}
                            className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center space-x-2"
                        >
                            <span>+</span>
                            <span>Thêm nhân viên</span>
                        </button>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white p-6 shadow-md">
                    <div className="mb-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-black" />
                            </div>
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên, email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Department Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                Phòng ban
                            </label>
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                            >
                                <option value="">Tất cả phòng ban</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>

                        {/* Role Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                Vai trò
                            </label>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                            >
                                <option value="">Tất cả vai trò</option>
                                {roles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                Trạng thái
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="active">Đang làm việc</option>
                                <option value="inactive">Tạm nghỉ</option>
                                <option value="terminated">Đã nghỉ việc</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Employee Table */}
                <div className="bg-white shadow-md mt-6">
                    {filteredEmployees.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">Không có nhân viên nào</p>
                            <p className="text-sm mt-2">Thử thay đổi bộ lọc hoặc thêm nhân viên mới</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NHÂN VIÊN</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PHÒNG BAN</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VAI TRÒ</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TRẠNG THÁI</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">THAO TÁC</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredEmployees.map(employee => (
                                            <tr key={employee.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                                                {employee.fullname.charAt(0).toUpperCase()}
                                                            </div>
                                                        </div>
                                                        <div className="ml-4 text-left">
                                                            <div className="text-sm font-medium text-gray-900">{employee.fullname}</div>
                                                            <div className="text-sm text-gray-500">{employee.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-left">
                                                    <div className="text-sm text-gray-900">{employee.departmentName}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-left">
                                                    <div className="text-sm text-gray-900">{employee.roleName}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-left">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(employee.status)}`}>
                                                        {getStatusText(employee.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                                    <button
                                                        onClick={() => handleViewDetail(employee.id)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
                                                    >
                                                        Xem chi tiết
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Hiển thị trang {pageNumber} trong {totalPages}, tổng số {totalCount} nhân viên
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex gap-1.5">
                                        <button
                                            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                                            disabled={pageNumber === 1}
                                            className="px-3 py-1 rounded border bg-white text-xs text-black disabled:opacity-50"
                                        >
                                            ‹
                                        </button>
                                        {Array.from({ length: totalPages }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setPageNumber(i + 1)}
                                                className={`px-3 py-1 rounded border text-xs font-medium ${pageNumber === i + 1 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-400 text-black'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setPageNumber(prev => Math.min(prev + 1, totalPages))}
                                            disabled={pageNumber === totalPages}
                                            className="px-3 py-1 rounded border bg-white text-xs text-black disabled:opacity-50"
                                        >
                                            ›
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeList;
