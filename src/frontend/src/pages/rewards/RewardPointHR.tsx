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


    // Mock data - thay bằng danh sách nhân viên mà manager quản lý qua API
    // const employees: Employee[] = [
    //     { id: '1', name: 'Nguyễn Văn An', position: 'Senior Developer', avatar: 'NVA', points: 450 },
    //     { id: '2', name: 'Trần Thị Bình', position: 'Developer', avatar: 'TTB', points: 320 },
    //     { id: '3', name: 'Lê Văn Cường', position: 'UI Designer', avatar: 'LVC', points: 280 },
    //     { id: '4', name: 'Phạm Thị Dung', position: 'Business Analyst', avatar: 'PTD', points: 390 },
    // ];

    const dispatch = useAppDispatch();
    const { employees, totalCount, loading: loadingEmployees, error: employeesError } = useAppSelector((state) => state.point);

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
        <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-xl">
                {/* Header */}
                <div className="rounded-lg p-6 mb-6 bg-blue-600">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <h1 className="text-3xl font-semibold text-center text-white">Tặng điểm thưởng</h1>
                    </div>
                    <p className="text-xl mb-4 text-center text-white">Khích lệ và khen thưởng nhân viên xuất sắc</p>
                    <div className="text-right">
                        {/* Điểm còn lại của quản lý = điểm hiện tại - điểm đã tặng*/}
                        <div className="text-3xl font-bold text-white">{remainingPoints}</div>
                        {/* Điểm hiện tại của quản lý - lấy từ API */}
                        <div className="text-sm text-white">/ {pointOfHR?.pointTotal || 0} điểm</div>
                        <div className="text-xs text-white">Điểm thưởng của bạn</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 mb-6 border-b">
                    <button
                        onClick={() => setActiveTab('increase')}
                        className={`pb-3 px-1 font-medium transition-colors relative ${activeTab === 'increase'
                            ? 'text-blue-700'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-left justify-center">
                                <span className="text-xs">↑</span>
                            </div>
                            <span className="text-left">Tặng điểm thưởng</span>
                        </div>
                        {activeTab === 'increase' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`pb-3 px-1 font-medium transition-colors relative ${activeTab === 'history'
                            ? 'text-blue-700'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                                <span className="text-xs">⟲</span>
                            </div>
                            Lịch sử tặng điểm
                        </div>
                        {activeTab === 'history' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>
                        )}
                    </button>
                </div>

                {/* Employee Selection */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="p-4 border-b flex items-left justify-between">
                        <h2 className="font-medium">Chọn nhân viên</h2>
                        <button className="text-sm text-blue-600 hover:text-blue-700">
                            0 người được chọn
                        </button>
                    </div>

                    <div className="p-4">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm nhân viên..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                            {filteredEmployees.map((employee) => (
                                <div
                                    key={employee.id}
                                    onClick={() => toggleEmployee(employee)}
                                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                                            {getInitials(employee.employeeName)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{employee.employeeName}</div>
                                            <div className="text-sm text-gray-500">Mã nhân viên: {employee.employeeId}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600">Điểm hiện tại</div>
                                        <div className="font-semibold text-blue-600">{employee.pointTotal}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        )}

                        {selectedEmployees.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                                <div className="text-sm text-gray-600 mb-2">Đã chọn: {selectedEmployees.length} nhân viên</div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedEmployees.map((emp) => (
                                        <div
                                            key={emp.id}
                                            className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                                        >
                                            <span>{emp.employeeName}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleEmployee(emp);
                                                }}
                                                className="hover:bg-blue-100 rounded-full p-0.5"
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
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="p-4 border-b">
                        <h2 className="font-medium">Thông tin tặng điểm</h2>
                    </div>

                    <div className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    style={{
                                        appearance: "textfield",
                                        WebkitAppearance: "none",
                                        MozAppearance: "textfield"
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lý do tặng điểm *
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Nhận xét về thành điểm đặt thuật, sự tối lợi..."
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24 resize-none"
                            />
                            <div className="text-xs text-gray-500 mt-1">0-25 ký tự tối thiểu</div>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="p-4 border-b">
                        <h2 className="font-medium">Tổng quan</h2>
                    </div>

                    <div className="p-4 space-y-3">
                        <div className="flex justify-between items-center ">
                            <span className="text-gray-600">Tổng điểm sẽ tặng</span>
                            <span className="font-semibold text-xl text-blue-600">{totalPointReward}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Số người</span>
                            <span className="text-gray-900">{selectedEmployees.length} người × {pointsPerPerson} điểm</span>
                        </div>
                        <div className="pt-3 border-t">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Dư âm dùng</span>
                                <span className="font-semibold">{remainingPoints - totalPointReward}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mt-1">
                                <span className="text-gray-600">Còn lại</span>
                                <span className="font-semibold">{(pointOfHR?.pointTotal || 0) - totalPointReward}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    disabled={selectedEmployees.length === 0 || pointsPerPerson <= 0 || totalPointReward > (pointOfHR?.pointTotal || 0)}
                    className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    onClick={() => {handleRewardPoints(selectedEmployees)}}
                    >
                    <span>📤</span>
                    <span>Tặng điểm ngay</span>
                </button>

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
            </div>
        </div>
    );
}