import { useEffect } from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  employeeName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal = ({
  isOpen,
  employeeName,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-brightness-60 transition-all flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center mb-4">
          <div className="shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa nhân viên</h3>
          </div>
        </div>
        <div className="mb-6">
          <p className="text-gray-600">
            Bạn có chắc chắn muốn xóa nhân viên{' '}
            <span className="font-semibold text-gray-900">{employeeName}</span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Xóa nhân viên
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
