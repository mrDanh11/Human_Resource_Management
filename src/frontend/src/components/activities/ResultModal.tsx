import { X, Save } from 'lucide-react';
import { 
  SportsForm, 
  TrainingForm, 
  VolunteerForm, 
  TeamBuildingForm, 
  CharityForm, 
  PerformanceRating 
} from './ActivityForms';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: any;
  activityType: string;
  activityName: string;
  form: any;
  onFormChange: (field: string, value: any) => void;
  onSave: () => void;
  isSaving: boolean;
}

export default function ResultModal({ 
  isOpen, 
  onClose, 
  participant, 
  activityType, 
  activityName, 
  form, 
  onFormChange, 
  onSave, 
  isSaving 
}: ResultModalProps) {
  if (!isOpen || !participant) return null;

  const renderFormContent = () => {
    switch (activityType) {
      case 'sports':
        return <SportsForm form={form} onChange={onFormChange} activityName={activityName} />;
      case 'training':
        return <TrainingForm form={form} onChange={onFormChange} />;
      case 'volunteer':
        return <VolunteerForm form={form} onChange={onFormChange} />;
      case 'team-building':
        return <TeamBuildingForm form={form} onChange={onFormChange} />;
      case 'charity':
        return <CharityForm form={form} onChange={onFormChange} />;
      default:
        return (
          <div className="text-center py-4 text-gray-500">
            Biểu mẫu cho loại hoạt động này chưa được hỗ trợ.
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500/75" onClick={onClose} />

        <div className="relative z-50 inline-block w-full max-w-2xl p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
            <div>
              <h3 className="text-lg font-bold">Cập nhật kết quả</h3>
              <p className="text-sm text-blue-100 mt-1">
                {participant.employeeName} - {participant.employeeCode}
              </p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
            {/* Luôn hiển thị đánh giá trước */}
            <PerformanceRating form={form} onChange={onFormChange} />
            
            <div className="my-6 border-t border-gray-200"></div>
            
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
              Chi tiết kết quả
            </h4>
            
            {renderFormContent()}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none"
            >
              Hủy bỏ
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Đang lưu...' : 'Lưu kết quả & Đánh giá'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}