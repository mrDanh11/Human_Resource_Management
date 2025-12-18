import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import Header from '../../components/LandingPage/Header';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/LandingPage/Footer';

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
    organizer: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Create new activity:', formData);
    alert(`Đã tạo hoạt động mới: ${formData.name}`);
    // Navigate back to admin activities page
    navigate('/admin/activities');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxParticipants' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 bg-gray-50 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-8 h-8 text-white" />
                    <div className="text-2xl font-bold text-white">Tạo hoạt động mới</div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8">
                <div className="space-y-8">
                  {/* Basic Info Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Thông tin cơ bản
                    </h4>
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                          <option value="sports">Thể thao</option>
                          <option value="charity">Từ thiện</option>
                          <option value="training">Đào tạo</option>
                          <option value="team-building">Team Building</option>
                          <option value="volunteer">Tình nguyện</option>
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          placeholder="Tên đơn vị tổ chức..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Time Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Thời gian
                    </h4>
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location & Capacity Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Địa điểm & Số lượng
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Địa điểm <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          placeholder="Địa điểm tổ chức..."
                        />
                      </div>

                      {/* Max Participants */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số lượng tối đa <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="maxParticipants"
                          value={formData.maxParticipants}
                          onChange={handleChange}
                          required
                          min="1"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          placeholder="Số người tham gia tối đa..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Hình ảnh
                    </h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL hình ảnh
                      </label>
                      <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="text-xs text-gray-500 mt-1">Để trống nếu không có hình ảnh</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-8 border-t border-gray-200 mt-8">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/activities')}
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
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                    style={{
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 5px 20px rgba(37, 99, 235, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Tạo hoạt động
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
