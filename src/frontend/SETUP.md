# 🚀 Hướng dẫn cài đặt và chạy ứng dụng HRMS

## 📋 Yêu cầu hệ thống
- Node.js >= 18.0.0
- npm hoặc yarn
- Git

## ⚙️ Cài đặt Dependencies

### 1. Cài đặt packages cần thiết
```bash
# Di chuyển vào thư mục frontend
cd src/frontend

# Cài đặt dependencies
npm install

# Hoặc sử dụng yarn
yarn install
```

### 2. Cài đặt thêm dependencies bổ sung (nếu cần)
```bash
# Cài đặt lucide-react cho icons
npm install lucide-react

# Cài đặt zustand cho state management
npm install zustand

# Cài đặt Tailwind CSS và dependencies
npm install -D tailwindcss postcss autoprefixer
```

## 🎨 Cấu hình Tailwind CSS

### 1. Khởi tạo Tailwind config (nếu chưa có)
```bash
npx tailwindcss init -p
```

### 2. Cấu hình đã được tạo sẵn trong:
- `tailwind.config.js` - Cấu hình Tailwind với theme xanh dương
- `postcss.config.js` - Cấu hình PostCSS
- `src/index.css` - CSS chính với Tailwind imports

## 🏃‍♂️ Chạy ứng dụng

### 1. Development mode
```bash
# Chạy development server
npm run dev

# Hoặc
yarn dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

### 2. Build production
```bash
# Build cho production
npm run build

# Preview build
npm run preview
```

## 🔧 Cấu trúc dự án

```
src/
├── assets/                 # Hình ảnh, icons
│   ├── images/            # Logo, avatars
│   └── icons/             # SVG icons
├── components/            # React components
│   ├── common/           # Header, Sidebar, Modal
│   ├── activities/       # Components cho hoạt động
│   ├── profile/          # Components cho profile
│   ├── requests/         # Components cho yêu cầu
│   └── rewards/          # Components cho khen thưởng
├── constants/            # Constants và cấu hình
│   └── app.ts           # Main constants file
├── hooks/               # Custom React hooks
├── pages/               # Trang chính
├── services/            # API services
├── store/               # State management
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── App.tsx              # Component chính
└── main.tsx            # Entry point
```

## 📁 Assets cần thêm

### Hình ảnh cần thêm:
1. **Logo công ty**: `src/assets/images/logo.png`
2. **Avatar mặc định**: `src/assets/images/default-avatar.png`
3. **Icons**: `src/assets/icons/` (nếu cần custom icons)

### Đường dẫn assets đã được định nghĩa trong `constants/app.ts`:
```typescript
export const ASSET_PATHS = {
  logo: '/src/assets/images/logo.png',
  defaultAvatar: '/src/assets/images/default-avatar.png',
  icons: {
    company: '/src/assets/icons/company-icon.svg',
    notification: '/src/assets/icons/notification.svg',
    // ... các icons khác
  }
}
```

## 🎨 Theme và màu sắc

### Màu chủ đạo: Xanh dương
- Primary: `#3b82f6` (blue-500)
- Secondary: `#64748b` (slate-500)
- Success: `#10b981` (emerald-500)
- Warning: `#f59e0b` (amber-500)
- Error: `#ef4444` (red-500)

### Cấu hình theme trong `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: { /* blue color palette */ },
      secondary: { /* slate color palette */ },
    }
  }
}
```

## 🔑 Tính năng đã implement

### ✅ Hoàn thành:
- Layout responsive với Header + Sidebar
- Dashboard với phân quyền theo role
- Navigation system
- Theme xanh dương
- TypeScript setup
- Tailwind CSS integration
- Constants và type definitions

### 🚧 Cần phát triển:
- Authentication real
- API integration
- Các trang chức năng chi tiết
- Component library
- Error handling
- Testing

## 👥 Demo Account

**Tài khoản demo mặc định:**
- Họ tên: Nguyễn Chí Danh
- Role: Employee
- Email: danh.nguyen@company.com
- Điểm hiện tại: 2,580

## 🛠️ Scripts có sẵn

```bash
npm run dev        # Chạy development server
npm run build      # Build cho production  
npm run preview    # Preview production build
npm run lint       # Chạy ESLint
```

## 📞 Hỗ trợ

Nếu gặp vấn đề khi cài đặt hoặc chạy ứng dụng:

1. **Xóa node_modules và cài đặt lại:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Kiểm tra version Node.js:**
   ```bash
   node --version  # >= 18.0.0
   npm --version
   ```

3. **Clear cache:**
   ```bash
   npm run dev -- --force
   ```

---

**Group 07 - CSC12005**  
**Trường Đại học Khoa học Tự nhiên - ĐHQG-HCM**