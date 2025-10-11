# Human Resource Management System

## 📖 Giới thiệu
Hệ thống quản lý nhân sự (Human Resource Management System) là một ứng dụng web toàn diện được thiết kế để quản lý các hoạt động nhân sự trong doanh nghiệp. Hệ thống cung cấp các tính năng quản lý thông tin nhân viên, xử lý yêu cầu, theo dõi hoạt động và hệ thống khen thưởng.

## 🏗️ Kiến trúc hệ thống
- **Backend**: Java Spring Boot MVC với RESTful API
- **Frontend**: ReactJS với TypeScript
- **Database**: PostgreSQL với JPA/Hibernate
- **Authentication**: Spring Security

## ✨ Tính năng chính

### 1. 👤 Quản lý Profile Nhân viên
- Quản lý thông tin cơ bản của nhân viên:
  - Họ tên, căn cước công dân
  - Mã số thuế
  - Địa chỉ liên lạc
  - Số điện thoại
  - Thông tin tài khoản ngân hàng
  - Các thông tin khác liên quan

### 2. 📋 Quản lý Yêu cầu Nhân viên
- **Các loại yêu cầu được hỗ trợ:**
  - Xin nghỉ phép (Leave)
  - Cập nhật bảng chấm công (Update time-sheet)
  - Check-in/Check-out
  - Làm việc từ xa (Work from home - WFH)

- **Quy trình xử lý:**
  - Nhân viên tạo yêu cầu
  - Quản lý phê duyệt/từ chối
  - Theo dõi trạng thái yêu cầu

### 3. 🏃‍♂️ Quản lý Hoạt động Nhân viên
- **Các hoạt động công ty:**
  - Tham gia chiến dịch chạy bộ
  - Theo dõi số km chạy được
  - Ghi nhận thời gian chạy
  - Tổng kết thành tích từ lúc bắt đầu đến khi kết thúc cuộc thi
  - Bảng xếp hạng hoạt động

### 4. 🏆 Hệ thống Khen thưởng
- **Quản lý điểm thưởng:**
  - Nhân viên nhận điểm thưởng hàng tháng
  - Quản lý có thể tặng điểm từ tài khoản cá nhân
  - Quy đổi điểm thành tiền mặt theo quy tắc định sẵn
  - Lịch sử giao dịch điểm thưởng

## 🛠️ Công nghệ sử dụng

### Backend
- **Framework**: Spring Boot 3.5.6
- **Java Version**: 17
- **Dependencies**:
  - Spring Boot Starter Web
  - Spring Boot Starter Data JPA
  - Spring Boot Starter Security
  - Spring Boot Starter Validation
- **Build Tool**: Maven

### Frontend
- **Framework**: React 19.1.1
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS
- **State Management**: Zustand (App Store)

## 📁 Cấu trúc Project

```
Human_Resource_Management/
├── docs/                           # Tài liệu dự án
├── src/
│   ├── backend/                    # Spring Boot API
│   │   ├── src/main/java/com/group07/human_resource_management/
│   │   ├── src/main/resources/
│   │   └── pom.xml
│   └── frontend/                   # React Application
│       ├── src/
│       │   ├── components/         # React Components
│       │   │   ├── activities/     # Quản lý hoạt động
│       │   │   ├── common/         # Components chung
│       │   │   ├── profile/        # Quản lý profile
│       │   │   ├── requests/       # Quản lý yêu cầu
│       │   │   └── rewards/        # Hệ thống khen thưởng
│       │   ├── pages/              # Các trang chính
│       │   ├── services/           # API Services
│       │   ├── store/              # State Management
│       │   ├── types/              # TypeScript Definitions
│       │   └── utils/              # Utilities
│       └── package.json
└── README.md
```

## 🚀 Cài đặt và Chạy ứng dụng

### Yêu cầu hệ thống
- Java 17+
- Node.js 18+
- Maven 3.6+
- PostgreSQL 12+

### Backend Setup
```bash
cd src/backend
./mvnw clean install
./mvnw spring-boot:run
```

Backend sẽ chạy trên: `http://localhost:8080`

### Frontend Setup
```bash
cd src/frontend
npm install
npm run dev
```

Frontend sẽ chạy trên: `http://localhost:5173`

## 📊 API Documentation
Chi tiết API có thể tìm thấy trong file `src/backend/API_README.md`

## 🔐 Authentication & Authorization
Hệ thống sử dụng Spring Security với các role:
- **EMPLOYEE**: Nhân viên thường
- **MANAGER**: Quản lý
- **ADMIN**: Quản trị viên

## 🤝 Đóng góp
Dự án được phát triển bởi Group 07 - HCMUS

### Thành viên nhóm:
| STT | MSSV     | Họ và Tên              |
|-----|----------|------------------------|
| 1   | 22120048 | Nguyễn Chí Danh        |
| 2   | 22120100 | Phạm Trần Trung Hậu    |
| 3   | 22120121 | Lê Viết Hưng           |
| 4   | 22120289 | Hồ Ngọc Trung Quân     |
| 5   | 22120402 | Trương Dương Anh Tú    |

## 📝 License
Dự án này được phát triển cho mục đích học tập tại Trường Đại học Khoa học Tự nhiên - ĐHQG-HCM

## 📞 Liên hệ
Nếu có thắc mắc về dự án, vui lòng liên hệ qua repository GitHub.

---

*Phát triển bởi Group 07 - Môn Phát triển ứng dụng hướng dịch vụ - HCMUS*
