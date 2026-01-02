import { useEffect } from 'react';
import { X, Calendar, Trophy } from 'lucide-react';
import type { ParticipationData } from '../../types/activity';

interface ActivityResultModalProps {
    participation: ParticipationData;
    isOpen: boolean;
    onClose: () => void;
}

export default function ActivityResultModal({ participation, isOpen, onClose }: ActivityResultModalProps) {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                className="fixed inset-0 backdrop-brightness-60 transition-all"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="flex items-center justify-center min-h-screen px-4 py-6 relative z-10">
                <div className="bg-white rounded-lg text-left overflow-y-auto shadow-xl transform transition-all w-full max-w-3xl max-h-[90vh]">
                    {/* Header Image */}
                    {participation.id && (
                        <div className="h-64 overflow-hidden relative">
                            <img
                                src={participation.imgPath}
                                alt={participation.activityName}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={onClose}
                                    className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="bg-white px-6 pt-5 pb-4">

                        {/* Title and Type Badge */}
                        <div className="mb-4">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <h3 className="text-2xl font-bold text-gray-900 flex-1" id="modal-title">
                                    {participation.activityName}
                                </h3>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Mô tả</h4>
                            <p className="text-gray-700 leading-relaxed">
                                {participation.description}
                            </p>
                        </div>

                        {/* Details Grid */}
                        <div className="space-y-4 mb-6">
                            <h4 className="text-lg font-semibold text-gray-900">Thông tin chi tiết</h4>

                            {/* Activity Time */}
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">Ngày đăng ký:</span> {formatDateTime(new Date(participation.registerDate).toLocaleDateString('vi-VN'))}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                                <div className="flex items-start gap-3">
                                    <Trophy className="w-5 h-5 text-red-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 mb-1">Thành tích của bạn</p>
                                        <p className="text-sm text-gray-700">
                                            {participation.result || "Chưa có kết quả"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-all"
                                style={{
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(156, 163, 175, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
