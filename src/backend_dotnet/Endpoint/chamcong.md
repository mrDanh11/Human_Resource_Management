# Attendance API Documentation

## 📋 Tổng quan

API quản lý chấm công (Attendance) cho phép:
- **Nhân viên**: Xem bảng công, thống kê, gửi yêu cầu chỉnh sửa
- **HR**: Quản lý, chỉnh sửa, nhập hàng loạt dữ liệu chấm công
- **System**: Đồng bộ từ máy chấm công

---

## 🔐 Authorization Policies

| Policy | Description | Roles |
|--------|-------------|-------|
| `attendance:view-own` | Xem attendance của mình | employee, hr, manager |
| `attendance:view` | Xem attendance của người khác | hr, manager |
| `attendance:list` | Xem danh sách attendance | hr, manager |
| `attendance:create` | Tạo attendance thủ công | hr |
| `attendance:update` | Chỉnh sửa attendance | hr |
| `attendance:delete` | Xóa attendance | hr, admin |
| `attendance:request-correction` | Gửi yêu cầu chỉnh sửa | employee |
| `attendance:sync` | Đồng bộ từ máy chấm công | system |

---

## 👤 EMPLOYEE ENDPOINTS

### 1. Xem Timesheet của mình
```http
GET /api/v1/attendance/my-timesheet?fromDate=2025-01-01&toDate=2025-01-31
Authorization: Bearer {token}
```

**Response:**
```json
{
  "employeeId": 6,
  "employeeName": "Nguyen Van Emp1",
  "fromDate": "2025-01-01",
  "toDate": "2025-01-31",
  "totalWorkingDays": 22,
  "presentDays": 20,
  "absentDays": 1,
  "lateDays": 3,
  "halfDays": 0,
  "wfhDays": 1,
  "totalWorkHours": 176.5,
  "totalOvertimeHours": 12.0,
  "averageWorkHoursPerDay": 8.02,
  "attendances": [...]
}
```

### 2. Xem Attendance theo ngày
```http
GET /api/v1/attendance/my-attendance/2025-01-15
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "employeeId": 6,
  "employeeName": "Nguyen Van Emp1",
  "employeeEmail": "emp1@company.com",
  "date": "2025-01-15",
  "checkinTime": "2025-01-15T08:25:00Z",
  "checkoutTime": "2025-01-15T17:35:00Z",
  "status": "present",
  "workHours": 8.17,
  "overtimeHours": 0.08,
  "isLate": false,
  "isEarlyLeave": false,
  "lateMinutes": null,
  "earlyLeaveMinutes": null
}
```

### 3. Xem Thống kê chấm công
```http
GET /api/v1/attendance/my-statistics?year=2025&month=1
Authorization: Bearer {token}
```

**Response:**
```json
{
  "employeeId": 6,
  "employeeName": "Nguyen Van Emp1",
  "year": 2025,
  "month": 1,
  "totalWorkingDays": 22,
  "presentDays": 20,
  "absentDays": 1,
  "lateDays": 3,
  "wfhDays": 1,
  "totalWorkHours": 176.5,
  "totalOvertimeHours": 12.0,
  "attendanceRate": 90.91,
  "totalLateMinutes": 85,
  "averageLateMinutes": 28
}
```

### 4. Gửi Yêu cầu chỉnh sửa
```http
POST /api/v1/attendance/correction-request
Authorization: Bearer {token}
Content-Type: application/json

{
  "date": "2025-01-15",
  "requestedCheckinTime": "2025-01-15T08:30:00Z",
  "requestedCheckoutTime": "2025-01-15T17:30:00Z",
  "reason": "Máy chấm công bị lỗi, tôi đã check-in lúc 8:30 nhưng hệ thống không ghi nhận",
  "attachment": "https://example.com/evidence.jpg"
}
```

**Response:**
```json
{
  "requestId": 15,
  "message": "Gửi yêu cầu chỉnh sửa thành công"
}
```

---

## 👔 HR ENDPOINTS

### 5. Lấy Danh sách Attendance (Filter & Pagination)
```http
GET /api/v1/attendance?employeeId=6&fromDate=2025-01-01&toDate=2025-01-31&status=present&pageNumber=1&pageSize=10
Authorization: Bearer {token}
```

**Query Parameters:**
- `employeeId` (optional): Filter theo nhân viên
- `fromDate` (optional): Từ ngày
- `toDate` (optional): Đến ngày
- `status` (optional): `present`, `absent`, `late`, `half_day`, `wfh`
- `pageNumber` (default: 1)
- `pageSize` (default: 10)

**Response:**
```json
[
  {
    "id": 1,
    "employeeId": 6,
    "employeeName": "Nguyen Van Emp1",
    "date": "2025-01-15",
    "checkinTime": "2025-01-15T08:25:00Z",
    "checkoutTime": "2025-01-15T17:35:00Z",
    "status": "present",
    "workHours": 8.17,
    "overtimeHours": 0.08
  }
]
```

### 6. Lấy Attendance theo ID
```http
GET /api/v1/attendance/1
Authorization: Bearer {token}
```

### 7. Tạo Attendance thủ công
```http
POST /api/v1/attendance
Authorization: Bearer {token}
Content-Type: application/json

{
  "employeeId": 6,
  "date": "2025-01-20",
  "checkinTime": "2025-01-20T08:30:00Z",
  "checkoutTime": "2025-01-20T17:30:00Z",
  "status": "present",
  "workHours": 8.0,
  "overtimeHours": 0,
  "note": "Nhập thủ công do máy chấm công lỗi"
}
```

**Response:**
```json
{
  "id": 25,
  "employeeId": 6,
  "employeeName": "Nguyen Van Emp1",
  "date": "2025-01-20",
  "checkinTime": "2025-01-20T08:30:00Z",
  "checkoutTime": "2025-01-20T17:30:00Z",
  "status": "present",
  "workHours": 8.0,
  "overtimeHours": 0,
  "note": "Nhập thủ công do máy chấm công lỗi",
  "createdAt": "2025-01-20T10:00:00Z"
}
```

### 8. Cập nhật Attendance (Chỉnh sửa khi máy chấm công sai)
```http
PUT /api/v1/attendance/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "checkinTime": "2025-01-15T08:30:00Z",
  "checkoutTime": "2025-01-15T17:30:00Z",
  "status": "present",
  "workHours": 8.0,
  "note": "Đã chỉnh sửa do máy chấm công ghi nhận sai"
}
```

### 9. Xóa Attendance
```http
DELETE /api/v1/attendance/1
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Xóa dữ liệu chấm công thành công"
}
```

### 10. Nhập hàng loạt (Bulk Import)
```http
POST /api/v1/attendance/bulk
Authorization: Bearer {token}
Content-Type: application/json

{
  "attendances": [
    {
      "employeeId": 6,
      "date": "2025-01-21",
      "checkinTime": "2025-01-21T08:30:00Z",
      "checkoutTime": "2025-01-21T17:30:00Z",
      "status": "present",
      "workHours": 8.0
    },
    {
      "employeeId": 7,
      "date": "2025-01-21",
      "checkinTime": "2025-01-21T08:45:00Z",
      "checkoutTime": "2025-01-21T17:30:00Z",
      "status": "late",
      "workHours": 7.75
    },
    {
      "employeeId": 8,
      "date": "2025-01-21",
      "status": "absent"
    }
  ]
}
```

**Response:**
```json
{
  "totalRecords": 3,
  "successCount": 3,
  "failedCount": 0,
  "errors": [],
  "createdAttendances": [...]
}
```

### 11. Xem Timesheet của nhân viên khác
```http
GET /api/v1/attendance/employee/6/timesheet?fromDate=2025-01-01&toDate=2025-01-31
Authorization: Bearer {token}
```

---

## 🤖 SYSTEM ENDPOINTS

### 12. Đồng bộ từ máy chấm công
```http
POST /api/v1/attendance/sync
Authorization: Bearer {system-token}
Content-Type: application/json

{
  "employeeId": 6,
  "date": "2025-01-22",
  "checkinTime": "2025-01-22T08:27:35Z",
  "checkoutTime": "2025-01-22T17:32:18Z",
  "deviceId": "DEVICE-001"
}
```

**Response:**
```json
{
  "id": 30,
  "employeeId": 6,
  "employeeName": "Nguyen Van Emp1",
  "date": "2025-01-22",
  "checkinTime": "2025-01-22T08:27:35Z",
  "checkoutTime": "2025-01-22T17:32:18Z",
  "status": "present",
  "workHours": 8.08
}
```

---

## 📊 Status Values

| Status | Description | Vietnamese |
|--------|-------------|------------|
| `present` | Có mặt | Đi làm |
| `absent` | Vắng mặt | Nghỉ |
| `late` | Đi muộn | Đi muộn |
| `half_day` | Nửa ngày | Nửa công |
| `wfh` | Work from home | Làm từ xa |

---

## 🔧 Business Rules

### Company Policy Settings
```csharp
// Giờ làm việc tiêu chuẩn
Standard Check-in: 08:30 AM
Standard Checkout: 05:30 PM

// Ngưỡng đi muộn/về sớm
Late Threshold: 15 minutes
Early Leave Threshold: 15 minutes

// Tính giờ làm việc
- Trừ 1 giờ nghỉ trưa nếu làm > 4 giờ
- OT = Số giờ làm thêm sau 8 giờ/ngày
```

### Auto Status Determination
- Check-in **> 08:45** → Status: `late`
- Check-in **≤ 08:45** → Status: `present`
- Không có check-in → Status: `absent`

### Work Hours Calculation
```
WorkHours = (CheckoutTime - CheckinTime) - 1 hour (lunch break if > 4 hours)
OvertimeHours = Max(0, WorkHours - 8)
```

---

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    "Employee ID is required",
    "Date is required"
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Employee ID not found in token"
}
```

### 404 Not Found
```json
{
  "message": "Không tìm thấy dữ liệu chấm công"
}
```

### 409 Conflict
```json
{
  "message": "Attendance already exists for employee 6 on 2025-01-20"
}
```

### 500 Internal Server Error
```json
{
  "message": "Lỗi khi tạo dữ liệu chấm công",
  "error": "Database connection failed"
}
```

---

## 📝 Notes

1. **Permissions**: Tất cả endpoints đều yêu cầu JWT token với permissions phù hợp
2. **Dates**: Sử dụng format `DateOnly` (YYYY-MM-DD) cho date fields
3. **Times**: Sử dụng ISO 8601 format với UTC timezone
4. **Validation**: Tất cả input đều được validate ở cả DTO level và business logic level
5. **Audit Trail**: Mọi thao tác CRUD đều được log với `createdBy`/`updatedBy`
6. **Soft Delete**: Có thể implement soft delete thay vì hard delete nếu cần

---

## 🔄 Integration Flow

### Flow 1: Đồng bộ tự động từ máy chấm công
```
Máy chấm công → POST /api/v1/attendance/sync
                 ↓
         Kiểm tra duplicate
                 ↓
    Tạo mới hoặc cập nhật attendance
                 ↓
         Tính toán status & work hours
```

### Flow 2: Nhân viên gửi yêu cầu chỉnh sửa
```
Employee → POST /api/v1/attendance/correction-request
             ↓
    Tạo Request (type: attendance_correction)
             ↓
         HR review & approve
             ↓
    PUT /api/v1/attendance/{id} (update attendance)
```

### Flow 3: HR nhập liệu thủ công hàng loạt
```
HR → POST /api/v1/attendance/bulk
       ↓
  Validate từng record
       ↓
  Tạo attendance cho mỗi record hợp lệ
       ↓
  Return summary (success/failed count)
```