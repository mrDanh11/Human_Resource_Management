import { useState, useEffect } from 'react';
import { X, MapPin, Users, Image as ImageIcon, Type, AlignLeft, Award, User } from 'lucide-react';
import type { CreateActivityRequest } from '../../types/activity';
import type { ActivityData } from '../../data/activityData';

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateActivityRequest) => Promise<void>;
  initialData?: ActivityData;
  title: string;
}

export default function ActivityFormModal({ isOpen, onClose, onSubmit, initialData, title }: ActivityFormModalProps) {
  const [formData, setFormData] = useState<CreateActivityRequest>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    registrationStartDate: '',
    registrationEndDate: '',
    maxParticipants: 0,
    location: '',
    activityType: 'sports',
    imageUrl: '',
    organizer: '',
    points: 0
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        registrationStartDate: initialData.registrationStart,
        registrationEndDate: initialData.registrationEnd,
        maxParticipants: initialData.maxParticipants || 0,
        location: initialData.location,
        activityType: initialData.type,
        imageUrl: initialData.imageUrl || '',
        organizer: initialData.organizer,
        points: initialData.points || 0
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        registrationStartDate: '',
        registrationEndDate: '',
        maxParticipants: 0,
        location: '',
        activityType: 'sports',
        imageUrl: '',
        organizer: '',
        points: 0
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxParticipants' || name === 'points' ? Number(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      <div className="flex items-center justify-center min-h-screen px-4 py-6 relative z-10">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">Tên hoạt động</label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tên hoạt động"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">Mô tả</label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả chi tiết về hoạt động"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-1">Ngày bắt đầu</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-1">Ngày kết thúc</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  required
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-1">Bắt đầu đăng ký</label>
                <input
                  type="datetime-local"
                  name="registrationStartDate"
                  required
                  value={formData.registrationStartDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-1">Kết thúc đăng ký</label>
                <input
                  type="datetime-local"
                  name="registrationEndDate"
                  required
                  value={formData.registrationEndDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Location & Participants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-1">Địa điểm</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Địa điểm tổ chức"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-1">Số lượng tối đa</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="maxParticipants"
                    required
                    min="1"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Type & Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-1">Loại hoạt động</label>
                <select
                  name="activityType"
                  value={formData.activityType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="sports">Thể thao</option>
                  <option value="charity">Từ thiện</option>
                  <option value="training">Đào tạo</option>
                  <option value="team-building">Team Building</option>
                  <option value="volunteer">Tình nguyện</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-1">Điểm thưởng</label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="points"
                    required
                    min="0"
                    value={formData.points}
                    onChange={handleChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Organizer & Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-1">Đơn vị tổ chức</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="organizer"
                    required
                    value={formData.organizer}
                    onChange={handleChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Phòng ban/Người tổ chức"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-1">URL Hình ảnh</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-all"
                style={{ transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 20px rgba(156, 163, 175, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(37, 99, 235, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {loading ? 'Đang xử lý...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
