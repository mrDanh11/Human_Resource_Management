import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import WfhForm from "../../components/requests/wfhRequest/WfhForm";
import WfhPreviewTimesheet from "../../components/requests/wfhRequest/WfhPreviewTimesheet";
import WfhQuotaCard from "../../components/requests/wfhRequest/WfhQuotaCard";

export default function WfhRequestPage() {
  const navigate = useNavigate();
  const [previewDates, setPreviewDates] = useState<string[]>([]);

  const handlePreviewUpdate = (dates: string[]) => {
    setPreviewDates(dates);
  };

  const handleSuccess = () => {
    // Navigate to "My Requests" page after successful submission
    navigate("/requests/my-requests");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/requests/create")}
            className="flex items-center gap-2 text-sm text-blue-900 hover:text-indigo-600 mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>

          <div className="flex items-center gap-3 mb-1 ml-1">
            {/* <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Home className="text-indigo-600" size={24} />
            </div> */}
            <div>
              <h1 className="text-xl font-bold text-blue-600">
                Gửi yêu cầu làm việc tại nhà
              </h1>
            </div>
          </div>
            <p className="text-sm text-gray-600 ml-1">
            Đăng ký làm việc tại nhà trong phạm vi cho phép để cho quản lý phê duyệt.
          </p>
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* LEFT - Form */}
          <div className="lg:col-span-2">
            <WfhForm 
              onSuccess={handleSuccess} 
              onPreviewUpdate={handlePreviewUpdate}
            />
          </div>

          {/* RIGHT - Status & Info */}
          <div className="lg:col-span-1 space-y-4">
            <WfhPreviewTimesheet previewDates={previewDates} />
            <WfhQuotaCard />
          </div>
        </div>
      </div>
    </div>
  );
}
