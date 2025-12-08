import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface Employee {
    id: string;
    name: string;
    position: string;
    avatar: string;
    points: number;
}

export default function RewardPointHR() {
    const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pointsPerPerson, setPointsPerPerson] = useState(50);
    const [note, setNote] = useState('');
    const [activeTab, setActiveTab] = useState<'increase' | 'history'>('increase');

    // Mock data - thay bằng danh sách nhân viên mà manager quản lý qua API
    const employees: Employee[] = [
        { id: '1', name: 'Nguyễn Văn An', position: 'Senior Developer', avatar: 'NVA', points: 450 },
        { id: '2', name: 'Trần Thị Bình', position: 'Developer', avatar: 'TTB', points: 320 },
        { id: '3', name: 'Lê Văn Cường', position: 'UI Designer', avatar: 'LVC', points: 280 },
        { id: '4', name: 'Phạm Thị Dung', position: 'Business Analyst', avatar: 'PTD', points: 390 },
    ];

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedEmployees.find(se => se.id === emp.id)
    );

    const toggleEmployee = (employee: Employee) => {
        if (selectedEmployees.find(e => e.id === employee.id)) {
            setSelectedEmployees(selectedEmployees.filter(e => e.id !== employee.id));
        } else {
            setSelectedEmployees([...selectedEmployees, employee]);
        }
    };

    const totalPoints = selectedEmployees.length * pointsPerPerson;
    const remainingPoints = 350 - totalPoints; {/* Điểm còn lại của quản lý = điểm hiện tại - điểm đã tặng*/ }

    return (
        <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-xl">
                {/* Header */}
                <div className="rounded-lg p-6 mb-6 text-blue-700">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <h1 className="text-sm font-semibold text-center">Tặng điểm thưởng</h1>
                    </div>
                    <p className="text-xs text-blue-600 mb-4 text-center">Khích lệ và khen thưởng nhân viên xuất sắc</p>
                    <div className="text-right">
                        {/* Điểm còn lại của quản lý = điểm hiện tại - điểm đã tặng*/}
                        <div className="text-3xl font-bold">{remainingPoints}</div>
                        {/* Điểm hiện tại của quản lý - lấy từ API */}
                        <div className="text-sm text-blue-700">/ 350 điểm</div>
                        <div className="text-xs text-blue-800 mt-1">Điểm thưởng của bạn</div>
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

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {filteredEmployees.map((employee) => (
                                <div
                                    key={employee.id}
                                    onClick={() => toggleEmployee(employee)}
                                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                                            {employee.avatar}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{employee.name}</div>
                                            <div className="text-sm text-gray-500">{employee.position}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600">Điểm hiện tại</div>
                                        <div className="font-semibold text-blue-600">{employee.points}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedEmployees.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                                <div className="text-sm text-gray-600 mb-2">Đã chọn: {selectedEmployees.length} nhân viên</div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedEmployees.map((emp) => (
                                        <div
                                            key={emp.id}
                                            className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                                        >
                                            <span>{emp.name}</span>
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
                            <span className="font-semibold text-xl text-blue-600">{totalPoints}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Số người</span>
                            <span className="text-gray-900">{selectedEmployees.length} người × {pointsPerPerson} điểm</span>
                        </div>
                        <div className="pt-3 border-t">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Dư âm dùng</span>
                                <span className="font-semibold">{remainingPoints - totalPoints}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mt-1">
                                <span className="text-gray-600">Còn lại</span>
                                <span className="font-semibold">{350 - totalPoints}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    disabled={selectedEmployees.length === 0 || !note}
                    className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <span>📤</span>
                    <span>Tặng điểm ngay</span>
                </button>
            </div>
        </div>
    );
}