// FILE: components/ActivityForms.tsx
import { Star, ThumbsUp, AlertTriangle } from 'lucide-react';
// --- INTERFACES ---
interface CommonProps {
  form: any;
  onChange: (field: string, value: any) => void;
}
// --- COMPONENT ĐÁNH GIÁ MỚI ---
export const PerformanceRating = ({ form, onChange }: any) => {
  const options = [
    {
      value: 'excellent',
      label: 'Xuất sắc',
      sub: 'Excellent',
      icon: Star,
      activeClass: 'border-yellow-500 bg-yellow-50 text-yellow-700 ring-1 ring-yellow-500',
      iconColor: 'text-yellow-500 fill-yellow-500' // Fill icon cho đẹp
    },
    {
      value: 'good',
      label: 'Tốt',
      sub: 'Good',
      icon: ThumbsUp,
      activeClass: 'border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500',
      iconColor: 'text-green-600'
    },
    {
      value: 'bad',
      label: 'Kém',
      sub: 'Bad',
      icon: AlertTriangle,
      activeClass: 'border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500',
      iconColor: 'text-red-500'
    }
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Label */}
      <label className="block text-sm font-semibold text-gray-700">
        Đánh giá hiệu suất <span className="text-red-500">*</span>
      </label>

      {/* Grid 3 lựa chọn */}
      <div className="grid grid-cols-3 gap-3">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = form.performance === option.value;
          
          return (
            <div
              key={option.value}
              onClick={() => onChange('performance', option.value)}
              className={`
                relative flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200
                ${isSelected 
                  ? option.activeClass 
                  : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-gray-50 text-gray-600'
                }
              `}
            >
              <Icon className={`w-6 h-6 mb-2 ${isSelected ? option.iconColor : 'text-gray-400'}`} />
              <div className="text-sm font-bold">{option.label}</div>
              <div className="text-xs opacity-80 font-medium">{option.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Phần Ghi chú đi kèm */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ghi chú đánh giá
        </label>
        <textarea
          value={form.note || ''}
          onChange={(e) => onChange('note', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          placeholder="Nhập ghi chú chi tiết về kết quả (nếu có)..."
        />
      </div>
    </div>
  );
};

// 2. Form Thể thao (Sports: Bơi & Chạy)
export const SportsForm = ({ form, onChange, activityName }: CommonProps & { activityName: string }) => {
  const isSwimming = activityName.toLowerCase().includes('bơi') || activityName.toLowerCase().includes('swim');

  if (isSwimming) {
    return (
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          🏊 Bơi lội
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kiểu bơi <span className="text-red-500">*</span>
            </label>
            <select
              value={form.style || ''}
              onChange={(e) => onChange('style', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">-- Chọn kiểu bơi --</option>
              <option value="freestyle">Bơi tự do (Freestyle)</option>
              <option value="backstroke">Bơi ngửa (Backstroke)</option>
              <option value="breaststroke">Bơi ếch (Breaststroke)</option>
              <option value="butterfly">Bơi bướm (Butterfly)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Khoảng cách (mét) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="10000"
              value={form.distance_m || ''}
              onChange={(e) => onChange('distance_m', e.target.value)}
              placeholder="50, 100, 200..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian hoàn thành <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.time || ''}
              onChange={(e) => onChange('time', e.target.value)}
              placeholder="HH:mm:ss (vd: 00:25:30)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Định dạng: 00:25:30</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thứ hạng
            </label>
            <input
              type="number"
              min="1"
              value={form.rank || ''}
              onChange={(e) => onChange('rank', e.target.value)}
              placeholder="1, 2, 3..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    );
  }

  // Running
  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
        🏃 Chạy bộ
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thời gian hoàn thành <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.time || ''}
            onChange={(e) => onChange('time', e.target.value)}
            placeholder="HH:mm:ss (vd: 01:30:45)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Định dạng: 01:30:45</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Khoảng cách (km) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="1000"
            value={form.distance_km || ''}
            onChange={(e) => onChange('distance_km', e.target.value)}
            placeholder="5.0, 10.0, 21.0..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thứ hạng
          </label>
          <input
            type="number"
            min="1"
            value={form.rank || ''}
            onChange={(e) => onChange('rank', e.target.value)}
            placeholder="1, 2, 3..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pace (phút/km)
          </label>
          <input
            type="text"
            value={form.pace_per_km || ''}
            onChange={(e) => onChange('pace_per_km', e.target.value)}
            placeholder="05:30"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

// 3. Form Đào tạo (Training)
export const TrainingForm = ({ form, onChange }: CommonProps) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số giờ tham dự <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={form.attendance_hours || ''}
          onChange={(e) => onChange('attendance_hours', e.target.value)}
          placeholder="8"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Điểm kiểm tra (0-100)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={form.quiz_score || ''}
          onChange={(e) => onChange('quiz_score', e.target.value)}
          placeholder="85"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ngày hoàn thành
        </label>
        <input
          type="date"
          value={form.completion_date || ''}
          onChange={(e) => onChange('completion_date', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="flex items-center pt-6">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.certificate_issued || false}
            onChange={(e) => onChange('certificate_issued', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Đã cấp chứng chỉ
          </span>
        </label>
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Nhận xét
      </label>
      <textarea
        value={form.feedback || ''}
        onChange={(e) => onChange('feedback', e.target.value)}
        rows={2}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        placeholder="Nhận xét về quá trình học tập..."
      />
    </div>
  </div>
);

// 4. Form Tình nguyện (Volunteer)
export const VolunteerForm = ({ form, onChange }: CommonProps) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số giờ đóng góp <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          step="0.5"
          value={form.hours_contributed || ''}
          onChange={(e) => onChange('hours_contributed', e.target.value)}
          placeholder="8.0"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Công nhận
        </label>
        <input
          type="text"
          value={form.recognition || ''}
          onChange={(e) => onChange('recognition', e.target.value)}
          placeholder="Giấy khen, bằng khen..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tác động
      </label>
      <textarea
        value={form.impact || ''}
        onChange={(e) => onChange('impact', e.target.value)}
        rows={2}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        placeholder="Mô tả tác động của hoạt động..."
      />
    </div>
  </div>
);

// 5. Form Team Building
export const TeamBuildingForm = ({ form, onChange }: CommonProps) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên đội
        </label>
        <input
          type="text"
          value={form.team_name || ''}
          onChange={(e) => onChange('team_name', e.target.value)}
          placeholder="Team Alpha"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Thứ hạng đội
        </label>
        <input
          type="number"
          value={form.team_rank || ''}
          onChange={(e) => onChange('team_rank', e.target.value)}
          placeholder="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Điểm đạt được
      </label>
      <input
        type="number"
        value={form.points_earned || ''}
        onChange={(e) => onChange('points_earned', e.target.value)}
        placeholder="100"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />
    </div>
  </div>
);

// 6. Form Từ thiện (Charity)
export const CharityForm = ({ form, onChange }: CommonProps) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số tiền quyên góp (VNĐ) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min="0"
          value={form.donation_amount || ''}
          onChange={(e) => onChange('donation_amount', e.target.value)}
          placeholder="500000"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hình thức quyên góp
        </label>
        <select
          value={form.donation_type || ''}
          onChange={(e) => onChange('donation_type', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="">-- Chọn hình thức --</option>
          <option value="money">Tiền mặt</option>
          <option value="goods">Hiện vật</option>
          <option value="other">Khác</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tổ chức nhận
        </label>
        <input
          type="text"
          value={form.recipient_organization || ''}
          onChange={(e) => onChange('recipient_organization', e.target.value)}
          placeholder="Quỹ Hy Vọng..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số giờ tình nguyện
        </label>
        <input
          type="number"
          step="0.5"
          min="0"
          value={form.hours_volunteered || ''}
          onChange={(e) => onChange('hours_volunteered', e.target.value)}
          placeholder="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center pt-6">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.receipt_issued || false}
            onChange={(e) => onChange('receipt_issued', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Đã có biên lai xác nhận
          </span>
        </label>
      </div>
      <div></div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tác động / Ý nghĩa
      </label>
      <textarea
        value={form.impact || ''}
        onChange={(e) => onChange('impact', e.target.value)}
        rows={2}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        placeholder="Mô tả ngắn gọn tác động của hoạt động này..."
      />
    </div>
  </div>
);