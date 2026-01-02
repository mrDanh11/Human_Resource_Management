import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Save, X, Users, Calendar, TrendingUp, Award, Loader2, AlertCircle, ArrowLeftRight, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllEmployeePoints } from '../../store/pointSlice';
import { fetchAllConversionRules } from '../../store/conversionRuleSlice'
import CreateExchangePointRule from '../../components/rewards/CreateExchangePointRule'

interface Role {
    id: string;
    name: string;
    monthlyPoints: number; //Chưa có trong database, thiết lập tại file này
    employeeCount: number; //Số lượng employee của role đó
    color: string;
    description: string;
}

interface DistributionHistory {
    id: string;
    month: string;
    totalDistributed: number;
    employeeCount: number;
    status: 'completed' | 'pending' | 'processing';
}

export default function PointsAdmin() {
    const [activeTab, setActiveTab] = useState<'roles' | 'employees' | 'history' | 'conversion'>('roles');
    const [editingRole, setEditingRole] = useState<string | null>(null);
    const [editingRule, setEditingRule] = useState<number | null>(null);
    const [deleteRule, setDeleteRule] = useState(false);
    const [isAddingRole, setIsAddingRole] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddingRule, setIsAddingRule] = useState(false);


    const itemsPerPage = 5;

    // Mock data - thay bằng danh sách vai trò từ API
    const [roles, setRoles] = useState<Role[]>([
        {
            id: '1',
            name: 'Administrator',
            monthlyPoints: 500,
            employeeCount: 8,
            color: 'blue',
            description: 'Lập trình viên cấp cao, lead technical'
        },
        {
            id: '2',
            name: 'Manager',
            monthlyPoints: 350,
            employeeCount: 15,
            color: 'green',
            description: 'Lập trình viên chính thức'
        },
        {
            id: '3',
            name: 'HR',
            monthlyPoints: 250,
            employeeCount: 10,
            color: 'yellow',
            description: 'Lập trình viên mới vào nghề'
        },
        {
            id: '4',
            name: 'Employee',
            monthlyPoints: 100,
            employeeCount: 20,
            color: 'purple',
            description: 'Thiết kế giao diện và trải nghiệm người dùng'
        },
    ]);

    // Redux
    const dispatch = useAppDispatch();
    const { employees, totalCount, loading: loadingEmployees, error: employeesError } = useAppSelector((state) => state.point);
    const { rules, loading: loadingRules, error: rulesError } = useAppSelector((state) => state.conversionRule);

    // Fetch employees data khi component mount hoặc khi chuyển sang tab employees
    useEffect(() => {
        dispatch(fetchAllEmployeePoints({ pageNumber: 1, pageSize: 100 }));
        dispatch(fetchAllConversionRules());
    }, [dispatch]);

    // Mock data - thay bằng lịch sử phân phối điểm từ API
    const history: DistributionHistory[] = [
        { id: '1', month: 'Tháng 12/2024', totalDistributed: 15420, employeeCount: 44, status: 'pending' },
        { id: '2', month: 'Tháng 11/2024', totalDistributed: 15380, employeeCount: 44, status: 'completed' },
        { id: '3', month: 'Tháng 10/2024', totalDistributed: 14950, employeeCount: 42, status: 'completed' },
    ];

    const totalMonthlyBudget = roles.reduce((sum, role) => sum + (role.monthlyPoints * role.employeeCount), 0);
    const totalEmployees = totalCount; // Tổng số nhân viên từ API

    const updateRolePoints = (roleId: string, newPoints: number) => {
        setRoles(roles.map(role =>
            role.id === roleId ? { ...role, monthlyPoints: newPoints } : role
        ));
    };

    const fotmatMoney = (amount: number) => {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    const updateConversionRule = (ruleId: number, newPoints: number, newMoney: number) => {

    };

    const handleDistributePoints = () => {
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const openAddConversionRuleForm = () => {
        setIsAddingRule(true);
    }

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; text: string; border: string }> = {
            blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
            green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
            yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
            purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
            pink: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
        };
        return colors[color] || colors.blue;
    };

    const filteredEmployees = employees.filter(emp =>
        emp.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

    // Reset về trang 1 khi search thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    console.log("rules =", rules);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-blue-600 rounded-lg p-6 mb-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                    <Award className="w-6 h-6 text-blue-600" />
                                </div>
                                <p className="text-2xl font-bold">Quản lý điểm thưởng</p>
                            </div>
                            <p className="text-blue-100">Quản lý điểm thưởng, phân phối điểm và cấp điểm hằng tháng</p>
                        </div>
                        <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2" onClick={handleDistributePoints}>
                            <Calendar className="w-5 h-5" />
                            Phân phối điểm tháng này
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="text-blue-100 text-xs mb-1">Tổng điểm cấp/tháng</div>
                            <div className="text-3xl font-bold">{totalMonthlyBudget.toLocaleString()}</div>
                            <div className="text-blue-200 text-xs mt-1">điểm</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="text-blue-100 text-xs mb-1">Tổng nhân viên</div>
                            <div className="text-3xl font-bold">{totalEmployees}</div>
                            <div className="text-blue-200 text-xs mt-1">người</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="text-blue-100 text-xs mb-1">Trung bình/người</div>
                            <div className="text-3xl font-bold">{Math.round(totalMonthlyBudget / totalEmployees)}</div>
                            <div className="text-blue-200 text-xs mt-1">điểm/tháng</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-around mb-6 border-b bg-white rounded-t-lg px-6">
                    <button
                        onClick={() => setActiveTab('roles')}
                        className={`py-4 px-2 font-medium transition-colors relative ${activeTab === 'roles' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Vai trò & Định mức
                        </div>
                        {activeTab === 'roles' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('employees')}
                        className={`py-4 px-2 font-medium transition-colors relative ${activeTab === 'employees' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Danh sách nhân viên
                        </div>
                        {activeTab === 'employees' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('conversion')}
                        className={`py-4 px-2 font-medium transition-colors relative ${activeTab === 'conversion' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <ArrowLeftRight className="w-5 h-5" />
                            Bảng quy đổi
                        </div>
                        {activeTab === 'conversion' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`py-4 px-2 font-medium transition-colors relative ${activeTab === 'history' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Lịch sử phân phối
                        </div>
                        {activeTab === 'history' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                        )}
                    </button>
                </div>

                {/* Roles Tab */}
                {activeTab === 'roles' && (
                    <div className="bg-white rounded-b-lg shadow-sm">
                        <div className="p-6 border-b flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Cấu hình định mức điểm theo vai trò</h2>
                                <p className="text-sm text-gray-500 mt-1">Thiết lập số điểm thưởng hằng tháng cho từng vị trí</p>
                            </div>
                            <button
                                onClick={() => setIsAddingRole(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Thêm thiết lập điểm
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="space-y-3">
                                {roles.map((role) => {
                                    const colorClasses = getColorClasses(role.color);
                                    const isEditing = editingRole === role.id;

                                    return (
                                        <div
                                            key={role.id}
                                            className={`border-2 ${colorClasses.border} rounded-lg p-4 hover:shadow-md transition-shadow ${colorClasses.bg}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className={`w-10 h-10 ${colorClasses.bg} border-2 ${colorClasses.border} rounded-lg flex items-center justify-center font-bold ${colorClasses.text}`}>
                                                            {role.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">{role.name}</h3>
                                                            <p className="text-sm text-gray-600">{role.description}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <div className="text-center">
                                                        <div className="text-sm text-gray-500">Số nhân viên</div>
                                                        <div className="text-xl font-bold text-gray-900">{role.employeeCount}</div>
                                                    </div>

                                                    <div className="text-center">
                                                        {isEditing ? (
                                                            <div>
                                                                <div className="text-sm text-gray-500 mb-1">Điểm/tháng</div>
                                                                <input
                                                                    type="number"
                                                                    defaultValue={role.monthlyPoints}
                                                                    onChange={(e) => updateRolePoints(role.id, Number(e.target.value))}
                                                                    className="w-24 px-3 py-1 border-2 border-blue-300 rounded-lg text-center font-bold text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="text-sm text-gray-500">Điểm/tháng</div>
                                                                <div className={`text-2xl font-bold ${colorClasses.text}`}>
                                                                    {role.monthlyPoints}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div className="text-center">
                                                        <div className="text-sm text-gray-500">Tổng/tháng</div>
                                                        <div className="text-xl font-bold text-gray-900">
                                                            {(role.monthlyPoints * role.employeeCount).toLocaleString()}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {isEditing ? (
                                                            <>
                                                                <button
                                                                    onClick={() => setEditingRole(null)}
                                                                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                                                >
                                                                    <Save className="w-5 h-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setEditingRole(null)}
                                                                    className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                                                >
                                                                    <X className="w-5 h-5" />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => setEditingRole(role.id)}
                                                                    className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                                                >
                                                                    <Edit2 className="w-5 h-5 text-gray-600" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
                {/* Employees Tab */}
                {activeTab === 'employees' && (
                    <div className="bg-white rounded-b-lg shadow-sm">
                        <div className="p-6 border-b">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold">Danh sách nhân viên</h2>
                                </div>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên, vai trò, phòng ban..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {loadingEmployees ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                                    <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
                                </div>
                            ) : employeesError ? (
                                <div className="flex flex-col items-center py-12 text-red-600">
                                    <AlertCircle className="h-12 w-12 mb-4" />
                                    <p className="font-medium">{employeesError}</p>
                                    <button
                                        onClick={() => dispatch(fetchAllEmployeePoints({ pageNumber: 1, pageSize: 100 }))}
                                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nhân viên
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Điểm hiện tại
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Cập nhật lần cuối
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentEmployees.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                    Không tìm thấy nhân viên nào
                                                </td>
                                            </tr>
                                        ) : (
                                            currentEmployees.map((employee) => (
                                                <tr key={employee.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                                                                {employee.employeeName.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{employee.employeeName}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {employee.email}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <div className="text-lg font-bold text-gray-900">
                                                            {employee.pointTotal}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                                                        {new Date(employee.lastUpdate).toLocaleDateString('vi-VN')}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Pagination */}
                        {!loadingEmployees && !employeesError && filteredEmployees.length > 0 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Trước
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Sau
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Hiển thị <span className="font-medium">{startIndex + 1}</span> - <span className="font-medium">{Math.min(endIndex, filteredEmployees.length)}</span> trong tổng số <span className="font-medium">{filteredEmployees.length}</span> nhân viên
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex gap-1.5" aria-label="Pagination">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="relative inline-flex items-center px-3 py-1.5 rounded border border-gray-400 bg-white text-xs font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed justify-center"
                                            >
                                                ‹
                                            </button>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`relative inline-flex items-center px-3 py-1.5 rounded border text-xs font-medium justify-center ${currentPage === page
                                                        ? 'bg-blue-600 border-blue-600 text-white'
                                                        : 'bg-white border-gray-400 text-black hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="relative inline-flex items-center px-3 py-1.5 rounded border border-gray-400 bg-white text-xs font-bold text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed justify-center"
                                            >
                                                ›
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/*Conversion Rule Page*/}
                {activeTab === 'conversion' && (
                    <div className="bg-white rounded-b-lg shadow-sm">
                        <div className="p-6 border-b flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Thiết lập quy đổi</h2>
                                <p className="text-sm text-gray-500 mt-1">Thiết lập quy đổi điểm thành tiền tương ứng</p>
                            </div>
                            <button
                                onClick={() => setIsAddingRule(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Thêm thiết lập quy đổi
                            </button>
                        </div>

                        <div className='overflow-x-auto'>
                            {loadingRules ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                                    <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
                                </div>
                            ) : rulesError ? (
                                <div className="flex flex-col items-center py-12 text-red-600">
                                    <AlertCircle className="h-12 w-12 mb-4" />
                                    <p className="font-medium">{rulesError}</p>
                                    <button
                                        onClick={() => dispatch(fetchAllConversionRules())}
                                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            ) : (
                                <div className="p-6">
                                    <div className="space-y-3">
                                        {rules.map((rule) => {
                                            const isEditing = editingRule === rule.id;

                                            return (
                                                <div
                                                    key={rule.id}
                                                    className={'border rounded-lg p-4 hover:shadow-md transition-shadow bg-white'}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
                                                                    <ArrowLeftRight className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold text-gray-900">{rule.pointValue} points</h3>
                                                                    <p className="text-sm text-gray-600">Quy định bởi {rule.updatedByName} vào {new Date(rule.updatedAt).toLocaleDateString('vi-VN')}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-6">

                                                            <div className="text-center">
                                                                {isEditing ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="text-sm text-gray-500">Số tiền</div>
                                                                        <input
                                                                            type="number"
                                                                            defaultValue={rule.moneyValue}
                                                                            onChange={() => updateConversionRule(rule.id, 222, 1111)}
                                                                            className="w-24 px-3 py-1 border-2 border-blue-300 rounded-lg text-center font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        />
                                                                        <div className="text-sm text-gray-500">Trạng thái</div>
                                                                        <select
                                                                            value={rule.isActive ? 'active' : 'inactive'}
                                                                            onChange={(e) => rule.isActive = e.target.value === 'active'}
                                                                            className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${rule.isActive
                                                                                ? 'border-green-600 text-green-600'
                                                                                : 'border-red-600 text-red-600'}} bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                                        >
                                                                            <option value="active">Đang áp dụng</option>
                                                                            <option value="inactive">Ngưng sử dụng</option>
                                                                        </select>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <div className="text-center">
                                                                            <div className="text-sm text-gray-500">Số tiền</div>
                                                                            <div className="text-xl font-bold text-blue-600">{fotmatMoney(rule.moneyValue)}</div>
                                                                        </div>
                                                                        <div
                                                                            className={`text-xs font-semibold ${rule.isActive ? 'text-green-600' : 'text-red-600'}`}
                                                                        >
                                                                            {rule.isActive ? 'Đang áp dụng' : 'Ngưng sử dụng'}
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                {isEditing ? (
                                                                    <>
                                                                        <button
                                                                            onClick={() => setEditingRule(null)}
                                                                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                                                        >
                                                                            <Save className="w-5 h-5" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setEditingRule(null)}
                                                                            className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                                                        >
                                                                            <X className="w-5 h-5" />
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <button
                                                                            onClick={() => setEditingRule(rule.id)}
                                                                            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                                                        >
                                                                            <Edit2 className="w-5 h-5 text-gray-600" />
                                                                        </button>
                                                                    </>
                                                                )}
                                                                <>
                                                                    <button
                                                                        onClick={() => setDeleteRule(true)}
                                                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                                    >
                                                                        <Trash2 className="w-5 h-5" />
                                                                    </button>
                                                                </>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                    <div className="bg-white rounded-b-lg shadow-sm">
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-semibold">Lịch sử phân phối điểm</h2>
                            <p className="text-sm text-gray-500 mt-1">Theo dõi các đợt phân phối điểm hằng tháng</p>
                        </div>

                        <div className="p-6 space-y-4">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
                                                <Calendar className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{item.month}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Phân phối cho {item.employeeCount} nhân viên
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <div className="text-sm text-gray-500">Tổng điểm</div>
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {item.totalDistributed.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showToast && (
                <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up z-50">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <span className="text-green-500 text-xl">✓</span>
                    </div>
                    <div>
                        <div className="font-semibold">Thành công!</div>
                        <div className="text-sm text-green-50">Đã cấp điểm hằng tháng</div>
                    </div>
                </div>
            )}

            {isAddingRule && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[500px] p-6">
                        <CreateExchangePointRule
                            onClose={() => setIsAddingRule(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}