import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Clock, 
  Home, 
  Briefcase, 
  Calendar, 
  RefreshCw,
  AlertCircle
} from "lucide-react";

interface RequestType {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bgColor: string;
  enabled: boolean;
  route: string;
}

export default function RequestSelectionPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const requestTypes: RequestType[] = [
    {
      id: "attendance",
      title: "Cập nhật giờ vào/ra",
      description: "Chỉnh sửa thời gian check-in/check-out khi quên chấm công",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      enabled: true,
      route: "/requests/create/attendance"
    },
    {
      id: "overtime",
      title: "Đăng ký OT",
      description: "Đăng ký làm thêm giờ ngoài giờ hành chính",
      icon: Briefcase,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      enabled: true,
      route: "/requests/create/overtime"
    },
    {
      id: "wfh",
      title: "Làm việc từ xa (WFH)",
      description: "Đăng ký làm việc tại nhà hoặc địa điểm khác",
      icon: Home,
      color: "text-green-600",
      bgColor: "bg-green-50",
      enabled: true,
      route: "/requests/create/wfh"
    },
    {
      id: "business_trip",
      title: "Công tác",
      description: "Đăng ký đi công tác trong hoặc ngoài nước",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      enabled: true,
      route: "/requests/create/business-trip"
    },
    {
      id: "shift_change",
      title: "Đổi ca làm việc",
      description: "Yêu cầu thay đổi ca làm việc theo lịch",
      icon: RefreshCw,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      enabled: true,
      route: "/requests/create/shift-change"
    }
  ];

  const handleSelectRequest = (type: RequestType) => {
    if (!type.enabled) {
      return;
    }
    setSelectedType(type.id);
    // Smooth transition animation before navigation
    setTimeout(() => {
      navigate(type.route);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50/20 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-700 drop-shadow-sm mb-2">
            Tạo mới yêu cầu
          </h1>
          <p className="text-base text-gray-600">
            Chọn loại yêu cầu bạn muốn gửi đến quản lý
          </p>
        </div>

        {/* Request Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requestTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <button
                key={type.id}
                onClick={() => handleSelectRequest(type)}
                disabled={!type.enabled}
                className={`
                  relative p-6 rounded-xl border-2 text-left transition-all duration-200 shadow-md
                  ${isSelected 
                    ? 'border-indigo-500 shadow-xl transform scale-105 bg-indigo-50' 
                    : 'border-gray-200 hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1'
                  }
                  ${!type.enabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'cursor-pointer'
                  }
                  bg-white
                `}
              >
                {/* Icon Section */}
                <div className={`
                  w-14 h-14 rounded-lg flex items-center justify-center mb-4
                  ${type.bgColor}
                `}>
                  <Icon size={28} className={type.color} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {type.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {type.description}
                </p>

                {/* Disabled Badge */}
                {!type.enabled && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md">
                    <AlertCircle size={14} className="text-gray-500" />
                    <span className="text-xs text-gray-600">Đang khóa</span>
                  </div>
                )}

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                Lưu ý khi gửi yêu cầu
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Yêu cầu sẽ được gửi đến quản lý trực tiếp để phê duyệt</li>
                <li>• Thời gian xử lý trung bình là 1-2 ngày làm việc</li>
                <li>• Bạn có thể theo dõi trạng thái yêu cầu tại mục "Danh sách yêu cầu"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
