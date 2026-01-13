import { useState, useEffect } from 'react';
import { AlertCircle, Loader2, Search, X } from 'lucide-react';
import { fetchAllEmployeePoints } from '../../store/pointSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { pointService } from '../../services/pointService';
import type { 
  EmployeePointDto, 
} from '../../services/pointService';

interface RewardEmployee {
    employeeId: number;
    value: number;
    type: string;
    description: string;
    actorId?: number;
}

export default function RewardPointHR() {
    const [selectedEmployees, setSelectedEmployees] = useState<EmployeePointDto[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pointsPerPerson, setPointsPerPerson] = useState(50);
    const [note, setNote] = useState('');
    const [activeTab, setActiveTab] = useState<'increase' | 'history'>('increase');
    const [showToast, setShowToast] = useState(false);

    const employeeId = parseInt(localStorage.getItem('userId') || '1');

    const [pointOfHR, setPointOfHR] = useState<EmployeePointDto | null>(null);
    // Lấy điểm thưởng của HR từ API
    useEffect(() => {
        if (!employeeId) return;

        pointService.getEmployeePoint(employeeId)
            .then(data => setPointOfHR(data))
            .catch(error =>
            console.error('Lỗi khi lấy điểm thưởng của HR:', error)
            );
        }, [employeeId]);

    const dispatch = useAppDispatch();
    const { employees, loading: loadingEmployees, error: employeesError } = useAppSelector((state) => state.point);

    useEffect(() => {
            dispatch(fetchAllEmployeePoints({ pageNumber: 1, pageSize: 100 }));
        }, [dispatch]);

    const filteredEmployees = employees.filter(emp =>
        emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedEmployees.find(se => se.id === emp.employeeId)
    );

    const toggleEmployee = (employee: EmployeePointDto) => {
        if (selectedEmployees.find(e => e.id === employee.id)) {
            setSelectedEmployees(selectedEmployees.filter(e => e.id !== employee.id));
        } else {
            setSelectedEmployees([...selectedEmployees, employee]);
        }
    };

    const handleRewardPoints = async (employeeList: EmployeePointDto[]) => {

        const hrsubpoint = {} as RewardEmployee;
        hrsubpoint.employeeId = employeeId;
        hrsubpoint.value = -(selectedEmployees.length * pointsPerPerson);
        hrsubpoint.type = "redeem";
        hrsubpoint.description = note;
        hrsubpoint.actorId = employeeId; // ID của HR đang tặng điểm

        // Gọi API để tặng điểm thưởng
        for( const emp of employeeList ) {
            try {
                const aemp = {} as RewardEmployee;
                aemp.employeeId = emp.employeeId;
                aemp.value = pointsPerPerson;
                aemp.type = "earn";
                aemp.description = note;
                aemp.actorId = employeeId; // ID của HR đang tặng điểm

                // console.log('Tặng điểm cho nhân viên:', aemp);

                await pointService.updatePoint(aemp.employeeId, {
                    value: aemp.value,
                    type: aemp.type,
                    description: aemp.description,
                    actorId: aemp.actorId
                });

                await pointService.updatePoint(hrsubpoint.employeeId, {
                    value: hrsubpoint.value,
                    type: hrsubpoint.type,
                    description: hrsubpoint.description,
                    actorId: hrsubpoint.actorId
                }); 

                // console.log(`Đã tặng ${pointsPerPerson} điểm cho nhân viên ID ${emp.employeeId}`);

                if (employeeId) {
                    const hrPoint = await pointService.getEmployeePoint(employeeId);
                    setPointOfHR(hrPoint);
                }

                setSelectedEmployees([]);
                setPointsPerPerson(50);
                setNote('');
                dispatch(fetchAllEmployeePoints({ pageNumber: 1, pageSize: 100 }));

                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 3000);


            } catch (error) {
                console.error(`Lỗi khi tặng điểm cho nhân viên ID ${emp.employeeId}:`, error);
            }
        }
    }

    function getInitials(fullName: string): string {
        return fullName
            .trim()
            .split(/\s+/)          // tách theo nhiều khoảng trắng
            .map(word => word[0])  // lấy chữ cái đầu
            .join("")
            .toUpperCase();
    }

    const totalPointReward = selectedEmployees.length * pointsPerPerson;
    const remainingPoints = (pointOfHR?.pointTotal || 0) - totalPointReward; {/* Điểm còn lại của quản lý = điểm hiện tại - điểm đã tặng*/ }

    return (
        <div className="min-h-screen w-full mx-auto bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="relative rounded-2xl p-8 mb-8 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <span className="text-3xl">🎁</span>
                            </div>
                            <h1 className="text-4xl font-bold text-center text-white tracking-tight">Tặng điểm thưởng</h1>
                        </div>
                        <p className="text-xl mb-6 text-center text-white/90 font-light">Khích lệ và khen thưởng nhân viên xuất sắc</p>
                        <div className="flex justify-center">
                            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/30">
                                <div className="text-center">
                                    <div className="text-sm text-white/80 mb-1">Điểm thưởng của bạn</div>
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="text-5xl font-bold text-white">{remainingPoints}</span>
                                        <span className="text-2xl text-white/70">/ {pointOfHR?.pointTotal || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Employee Selection */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6 bg-linear-to-r from-blue-50 to-purple-50 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
                                <span className="text-xl">👥</span>
                            </div>
                            <h2 className="font-bold text-lg text-gray-800">Chọn nhân viên</h2>
                        </div>
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                            {selectedEmployees.length} người được chọn
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm nhân viên..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>
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
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {filteredEmployees.map((employee) => (
                                <div
                                    key={employee.id}
                                    onClick={() => toggleEmployee(employee)}
                                    className="flex items-center justify-between p-4 hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl cursor-pointer transition-all duration-300 border-2 border-transparent hover:border-blue-200 hover:shadow-md group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-110 transition-transform duration-300">
                                            {getInitials(employee.employeeName)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{employee.employeeName}</div>
                                            <div className="text-sm text-gray-500">Mã NV: {employee.employeeId}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 mb-1">Điểm hiện tại</div>
                                        <div className="font-bold text-xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{employee.pointTotal}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        )}

                        {selectedEmployees.length > 0 && (
                            <div className="mt-6 pt-6 border-t-2 border-gray-100">
                                <div className="text-sm font-semibold text-gray-700 mb-3">Đã chọn: {selectedEmployees.length} nhân viên</div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedEmployees.map((emp) => (
                                        <div
                                            key={emp.id}
                                            className="flex items-center gap-2 bg-linear-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <span>{emp.employeeName}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleEmployee(emp);
                                                }}
                                                className="hover:bg-white/50 rounded-full p-1 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Points Configuration */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6 bg-linear-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white">
                                <span className="text-xl">⚙️</span>
                            </div>
                            <h2 className="font-bold text-lg text-gray-800">Thông tin tặng điểm</h2>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                Số điểm tặng (mỗi người)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={pointsPerPerson}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        if (val >= 0 || e.target.value === "") {
                                            setPointsPerPerson(val);
                                        }
                                    }}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 font-semibold text-lg"
                                    style={{
                                        appearance: "textfield",
                                        WebkitAppearance: "none",
                                        MozAppearance: "textfield"
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                Lý do tặng điểm *
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Nhận xét về thành điểm đặt thuật, sự tối lợi..."
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 min-h-32 resize-none"
                            />
                            <div className="text-xs text-gray-500 mt-2">0-25 ký tự tối thiểu</div>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6 bg-linear-to-r from-green-50 to-teal-50 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-r from-green-600 to-teal-600 rounded-xl flex items-center justify-center text-white">
                                <span className="text-xl">📊</span>
                            </div>
                            <h2 className="font-bold text-lg text-gray-800">Tổng quan</h2>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl">
                            <span className="text-gray-700 font-semibold">Tổng điểm sẽ tặng</span>
                            <span className="font-bold text-3xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{totalPointReward}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Số người</span>
                            <span className="text-gray-900 font-semibold">{selectedEmployees.length} người × {pointsPerPerson} điểm</span>
                        </div>
                        <div className="pt-4 border-t-2 border-gray-100 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Còn lại</span>
                                <span className="font-bold text-green-600">{(pointOfHR?.pointTotal || 0) - totalPointReward}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    disabled={selectedEmployees.length === 0 || pointsPerPerson <= 0 || totalPointReward > (pointOfHR?.pointTotal || 0)}
                    className="w-full bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100 disabled:shadow-none"
                    onClick={() => {handleRewardPoints(selectedEmployees)}}
                    >
                    <span className="text-2xl">📤</span>
                    <span className="text-lg">Tặng điểm ngay</span>
                </button>

                {showToast && (
                <div className="fixed bottom-8 right-8 bg-linear-to-r from-green-500 to-emerald-500 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 animate-slide-up z-50 border-2 border-white">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-green-500 text-3xl font-bold">✓</span>
                    </div>
                    <div>
                        <div className="font-bold text-lg">Thành công!</div>
                        <div className="text-sm text-green-50">Đã cấp điểm hằng tháng</div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}