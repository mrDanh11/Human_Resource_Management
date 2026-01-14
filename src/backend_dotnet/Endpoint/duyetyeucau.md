# Request Management API Documentation

## 📋 Tổng quan

API quản lý yêu cầu (Requests) cho phép:
- **Nhân viên**: Xem requests của mình
- **HR/Manager**: Xem tất cả requests, phê duyệt/từ chối
- **System**: Auto-update attendance khi approve correction requests

---

## 🔐 Authorization Policies

| Policy | Description | Roles |
|--------|-------------|-------|
| `request:view-own` | Xem requests của mình | employee, hr, manager |
| `request:view` | Xem chi tiết request | employee (own), hr, manager |
| `request:list` | Xem danh sách tất cả requests | hr, manager |
| `request:approve` | Phê duyệt/từ chối requests | hr, manager |
| `request:delete` | Xóa requests | hr, admin |
| `request:statistics` | Xem thống kê | hr, manager, admin |

---

## 👤 EMPLOYEE ENDPOINTS

### 1. Xem requests của mình
```http
GET /api/v1/request/my-requests
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 15,
    "employeeId": 6,
    "employeeName": "Nguyen Van Emp1",
    "employeeEmail": "emp1@company.com",
    "departmentName": "Engineering",
    "description": "Correction request for 2025-01-15: Máy chấm công bị lỗi",
    "startTime": "2025-01-15T08:30:00Z",
    "endTime": "2025-01-15T17:30:00Z",
    "type": "attendance_correction",
    "typeDisplay": "Chỉnh sửa chấm công",
    "attachment": "https://example.com/evidence.jpg",
    "status": "pending",
    "statusDisplay": "Chờ duyệt",
    "createdAt": "2025-01-16T10:00:00Z",
    "updatedAt": "2025-01-16T10:00:00Z",
    "approvalHistories": [],
    "attendanceDetail": {
      "date": "2025-01-15",
      "currentCheckinTime": "2025-01-15T09:30:00Z",
      "currentCheckoutTime": "2025-01-15T17:30:00Z",
      "currentWorkHours": 7.0,
      "currentStatus": "late",
      "requestedCheckinTime": "2025-01-15T08:30:00Z",
      "requestedCheckoutTime": "2025-01-15T17:30:00Z"
    }
  }
]
```

### 2. Xem chi tiết request
```http
GET /api/v1/request/15
Authorization: Bearer {token}
```

**Response:** Giống như trên (single object)

---

## 👔 HR/MANAGER ENDPOINTS

### 3. Lấy danh sách tất cả requests (với filter)
```http
GET /api/v1/request?employeeId=6&type=attendance_correction&status=pending&pageNumber=1&pageSize=10
Authorization: Bearer {token}
```

**Query Parameters:**
- `employeeId` (optional): Filter theo nhân viên
- `type` (optional): `wfh`, `leave`, `overtime`, `attendance_correction`, `equipment`, `other`
- `status` (optional): `pending`, `approved`, `rejected`
- `fromDate` (optional): Từ ngày
- `toDate` (optional): Đến ngày
- `pageNumber` (default: 1)
- `pageSize` (default: 10)

### 4. Lấy danh sách requests chờ duyệt
```http
GET /api/v1/request/pending
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 15,
    "employeeId": 6,
    "employeeName": "Nguyen Van Emp1",
    "description": "Correction request for 2025-01-15",
    "type": "attendance_correction",
    "status": "pending",
    "createdAt": "2025-01-16T10:00:00Z"
  },
  {
    "id": 16,
    "employeeId": 7,
    "employeeName": "Tran Thi Emp2",
    "description": "WFH request",
    "type": "wfh",
    "status": "pending",
    "createdAt": "2025-01-16T11:00:00Z"
  }
]
```

### 5. Phê duyệt hoặc từ chối request ⭐
```http
POST /api/v1/request/15/process
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "approved",
  "note": "Đã kiểm tra và phê duyệt",
  "autoUpdateAttendance": true
}
```

**Request Body:**
- `status`: **required** - `approved` hoặc `rejected`
- `note`: optional - Ghi chú của người duyệt
- `autoUpdateAttendance`: default `true` - Tự động update attendance nếu approve correction request

**Response:**
```json
{
  "message": "Đã phê duyệt yêu cầu",
  "data": {
    "id": 15,
    "status": "approved",
    "approvalHistories": [
      {
        "id": 1,
        "approverId": 2,
        "approverName": "Tran Thi HR",
        "status": "approved",
        "statusDisplay": "Đã duyệt",
        "note": "Đã kiểm tra và phê duyệt",
        "createdAt": "2025-01-16T14:00:00Z"
      }
    ]
  }
}
```

**Auto-Update Attendance:**
Khi `autoUpdateAttendance = true` và `status = approved`:
1. ✅ Tự động cập nhật attendance record
2. ✅ Update check-in/check-out time
3. ✅ Recalculate work hours
4. ✅ Update status (late/present)
5. ✅ Add note về request ID

### 6. Phê duyệt/từ chối hàng loạt
```http
POST /api/v1/request/batch-process
Authorization: Bearer {token}
Content-Type: application/json

{
  "requestIds": [15, 16, 17],
  "status": "approved",
  "note": "Phê duyệt hàng loạt",
  "autoUpdateAttendance": true
}
```

**Response:**
```json
{
  "message": "Xử lý hoàn tất: 3 thành công, 0 thất bại",
  "data": {
    "totalRequests": 3,
    "successCount": 3,
    "failedCount": 0,
    "errors": []
  }
}
```

### 7. Xóa request
```http
DELETE /api/v1/request/15
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Xóa yêu cầu thành công"
}
```

---

## 📊 STATISTICS

### 8. Xem thống kê requests
```http
GET /api/v1/request/statistics
Authorization: Bearer {token}
```

**Response:**
```json
{
  "totalRequests": 150,
  "pendingRequests": 12,
  "approvedRequests": 120,
  "rejectedRequests": 18,
  "requestsByType": {
    "attendance_correction": 45,
    "wfh": 30,
    "leave": 40,
    "overtime": 20,
    "equipment": 10,
    "other": 5
  },
  "requestsByStatus": {
    "pending": 12,
    "approved": 120,
    "rejected": 18
  }
}
```

---

## 🔄 Complete Flow: Attendance Correction

### Step 1: Employee gửi request
```http
POST /api/v1/attendance/correction-request
{
  "date": "2025-01-15",
  "requestedCheckinTime": "2025-01-15T08:30:00Z",
  "requestedCheckoutTime": "2025-01-15T17:30:00Z",
  "reason": "Máy chấm công bị lỗi",
  "attachment": "https://example.com/evidence.jpg"
}
```
**Result:** Request ID = 15, Status = "pending"

### Step 2: HR xem requests chờ duyệt
```http
GET /api/v1/request/pending
```
**Result:** List chứa request #15

### Step 3: HR xem chi tiết request
```http
GET /api/v1/request/15
```
**Result:** Full detail với current & requested values

### Step 4: HR approve request
```http
POST /api/v1/request/15/process
{
  "status": "approved",
  "note": "Đã xác minh với manager",
  "autoUpdateAttendance": true
}
```

**Behind the scenes:**
1. ✅ Tạo ApprovalHistory record
2. ✅ Update Request.status = "approved"
3. ✅ Auto-update Attendance (nếu autoUpdateAttendance = true):
   - Update check-in time = 08:30
   - Update check-out time = 17:30
   - Recalculate work hours = 8.0
   - Update status = "present" (không late nữa)
   - Add note = "Updated from correction request #15"

### Step 5: Employee check lại
```http
GET /api/v1/attendance/my-attendance/2025-01-15
```
**Result:** Attendance đã được update với giá trị mới ✅

---

## 📋 Request Types

| Type | Vietnamese | Description |
|------|-----------|-------------|
| `attendance_correction` | Chỉnh sửa chấm công | Sửa check-in/out time |
| `wfh` | Làm từ xa | Work from home |
| `leave` | Nghỉ phép | Annual leave, sick leave |
| `overtime` | Làm thêm giờ | Overtime request |
| `equipment` | Thiết bị | Equipment request |
| `other` | Khác | Other requests |

---

## 📋 Request Status

| Status | Vietnamese | Description |
|--------|-----------|-------------|
| `pending` | Chờ duyệt | Waiting for approval |
| `approved` | Đã duyệt | Approved |
| `rejected` | Đã từ chối | Rejected |

---

## 🔧 Business Rules

### Approval Rules
1. ✅ Chỉ có thể approve/reject requests với status = "pending"
2. ✅ Không thể approve request đã approved/rejected
3. ✅ Mỗi request chỉ cần 1 approval (không cần multi-level)
4. ✅ HR/Manager có thể approve bất kỳ request nào

### Auto-Update Rules (Attendance Correction)
1. ✅ Chỉ auto-update khi status = "approved"
2. ✅ Chỉ auto-update khi type = "attendance_correction"
3. ✅ Chỉ auto-update khi autoUpdateAttendance = true
4. ✅ Phải có StartTime và EndTime
5. ✅ Attendance record phải tồn tại
6. ✅ Recalculate work hours & status sau khi update

### Permission Rules
1. ✅ Employee chỉ xem được requests của mình
2. ✅ HR/Manager xem được tất cả requests
3. ✅ Chỉ HR/Manager mới approve được
4. ✅ Không thể approve request của chính mình (tùy business logic)

---

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "message": "Request is already approved"
}
```

### 404 Not Found
```json
{
  "message": "Request not found"
}
```

### 403 Forbidden
```json
{
  "message": "You don't have permission to view this request"
}
```

### 500 Internal Server Error
```json
{
  "message": "Lỗi khi xử lý yêu cầu",
  "error": "Database connection failed"
}
```

---

## 💡 Tips & Best Practices

### For Employees
1. **Provide evidence**: Attach screenshots hoặc photos khi gửi correction request
2. **Clear reason**: Mô tả rõ lý do để HR dễ review
3. **Timely**: Gửi request sớm, đừng đợi đến cuối tháng

### For HR/Managers
1. **Review carefully**: Xem attendance detail trước khi approve
2. **Add notes**: Ghi lại lý do approve/reject để audit sau này
3. **Batch process**: Dùng batch API cho nhiều requests cùng lúc
4. **Auto-update**: Bật autoUpdateAttendance để tự động update attendance

### For System
1. **Transaction**: Sử dụng database transaction để đảm bảo data consistency
2. **Logging**: Log tất cả approval actions
3. **Notification**: Có thể thêm email/push notification khi request được processed
4. **Audit trail**: ApprovalHistory lưu lại toàn bộ lịch sử

---

## 🔄 Integration Points

### Current Integrations
1. **Attendance Management** - Auto-update attendance after approval
2. **Employee Management** - Get employee info
3. **Authentication** - JWT validation

### Future Integrations
1. **Notification Service** - Email/Push when request processed
2. **Leave Management** - Track leave days
3. **Approval Workflow** - Multi-level approval
4. **Manager Assignment** - Auto-route to direct manager

---

## 📝 Database Schema

### Request Table
```sql
CREATE TABLE request (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    type VARCHAR(50) NOT NULL,
    attachment TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(id)
);
```

### Approval History Table
```sql
CREATE TABLE approval_history (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL,
    approver_id INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES request(id),
    FOREIGN KEY (approver_id) REFERENCES employee(id)
);
```

---

## ✅ Summary

**Request Management System provides:**
- ✅ Complete request lifecycle management
- ✅ Single & batch approval
- ✅ Auto-update attendance on approval
- ✅ Full audit trail with approval history
- ✅ Statistics & reporting
- ✅ Permission-based access control
- ✅ Transaction safety

**Total: 8 endpoints**
- 2 for Employee
- 5 for HR/Manager
- 1 for Statistics