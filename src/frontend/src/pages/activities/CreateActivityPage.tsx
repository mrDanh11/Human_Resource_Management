import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Sparkles, MapPin, Users, Award, Clock, Image } from 'lucide-react';
import { createActivity } from '../../services/activityService';
import type { CreateActivityRequest } from '../../types/activity';

export interface CreateActivityData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationStart: string;
  registrationEnd: string;
  maxParticipants: number;
  location: string;
  type: 'sports' | 'charity' | 'training' | 'team-building' | 'volunteer';
  imageUrl: string;
  organizer: string;
  points: number;
}

export default function CreateActivityPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateActivityData>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    registrationStart: '',
    registrationEnd: '',
    maxParticipants: 50,
    location: '',
    type: 'sports',
    imageUrl: '',
    organizer: '',
    points: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const request: CreateActivityRequest = {
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate + ":00", // Append seconds if needed by backend
        endDate: formData.endDate + ":00",
        registrationStartDate: formData.registrationStart + ":00",
        registrationEndDate: formData.registrationEnd + ":00",
        maxParticipants: formData.maxParticipants,
        location: formData.location,
        activityType: formData.type,
        imageUrl: formData.imageUrl,
        organizer: formData.organizer,
        points: formData.points
      };
      
      await createActivity(request);
      alert(`Đã tạo hoạt động mới: ${formData.name}`);
      navigate('/admin/activities');
    } catch (error) {
      console.error("Failed to create activity", error);
      alert("Có lỗi xảy ra khi tạo hoạt động");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxParticipants' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <motion.div 
              className="relative bg-blue-600 p-8 shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
              
              <div className="relative z-10 flex items-center space-x-4">
                <motion.div 
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    Tạo hoạt động mới
                  </h1>
                  <p className="text-white/90 mt-1">Thêm sự kiện và hoạt động cho nhân viên</p>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8">
            <motion.div 
              className="space-y-8"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {/* Basic Info Section */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-linear-to-r from-blue-500 to-purple-500">
                  <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="text-white w-5 h-5" />
                  </div>
                  <h4 className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Thông tin cơ bản
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Activity Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên hoạt động <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Nhập tên hoạt động..."
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Mô tả chi tiết về hoạt động..."
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại hoạt động <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="sports">🏃 Thể thao</option>
                      <option value="charity">❤️ Từ thiện</option>
                      <option value="training">📚 Đào tạo</option>
                      <option value="team-building">🤝 Team Building</option>
                      <option value="volunteer">🌟 Tình nguyện</option>
                    </select>
                  </div>

                  {/* Organizer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Đơn vị tổ chức <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="organizer"
                      value={formData.organizer}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Tên đơn vị tổ chức..."
                    />
                  </div>

                  {/* Points */}
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      Điểm thưởng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="points"
                      value={formData.points}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Số điểm thưởng..."
                    />
                  </div>
                </div>
              </motion.div>

              {/* Time Section */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-linear-to-r from-purple-500 to-pink-500">
                  <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="text-white w-5 h-5" />
                  </div>
                  <h4 className="text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Thời gian
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Activity Start */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bắt đầu hoạt động <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>

                  {/* Activity End */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kết thúc hoạt động <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>

                  {/* Registration Start */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bắt đầu đăng ký <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="registrationStart"
                      value={formData.registrationStart}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>

                  {/* Registration End */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kết thúc đăng ký <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="registrationEnd"
                      value={formData.registrationEnd}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Location & Capacity Section */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-linear-to-r from-green-500 to-teal-500">
                  <div className="w-10 h-10 bg-linear-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <MapPin className="text-white w-5 h-5" />
                  </div>
                  <h4 className="text-xl font-bold bg-linear-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                    Địa điểm & Số lượng
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-500" />
                      Địa điểm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      placeholder="Địa điểm tổ chức..."
                    />
                  </div>

                  {/* Max Participants */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-teal-500" />
                      Số lượng tối đa <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      placeholder="Số người tham gia tối đa..."
                    />
                  </div>
                </div>
              </motion.div>

              {/* Image Section */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-linear-to-r from-orange-500 to-red-500">
                  <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Image className="text-white w-5 h-5" />
                  </div>
                  <h4 className="text-xl font-bold bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Hình ảnh
                  </h4>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL hình ảnh
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">💡 Để trống nếu không có hình ảnh</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Actions */}
            <motion.div 
              className="flex gap-4 pt-8 border-t-2 border-gray-200 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                type="button"
                onClick={() => navigate('/admin/activities')}
                className="flex-1 px-6 py-3 bg-linear-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 rounded-xl font-semibold shadow-lg transition-all"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Hủy bỏ
              </motion.button>
              <motion.button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg transition-all"
                whileHover={{ scale: 1.02, y: -2, boxShadow: "0 10px 40px rgba(37, 99, 235, 0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                ✨ Tạo hoạt động
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
