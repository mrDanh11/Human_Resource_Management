## 1. Test Cập nhật điểm thưởng

### Endpoint
```
PUT /api/point/employee/{employeeId}
```

### Request Body
```json
{
  "value": 100,
  "type": "earn",
  "description": "Hoàn thành xuất sắc dự án Q4",
  "actorId": 1
}
```

### Các tham số:
- **value**: Số điểm (từ -10000 đến 10000)
- **type**: Loại giao dịch
  - `"earn"` - Thêm điểm (cộng điểm)
  - `"redeem"` - Dùng điểm (trừ điểm)
  - `"adjustment"` - Điều chỉnh (set điểm = value)
  - `"transfer"` - Chuyển điểm (hiện chưa dùng)
- **description**: Mô tả (optional, max 500 ký tự)
- **actorId**: ID của người thực hiện (optional, có thể null)

### Test Cases

#### Test 1: Thêm điểm (EARN)
```bash
# Giả sử employee ID = 6 hiện có 800 điểm
# Admin (ID = 1) thêm 100 điểm

PUT http://localhost:5258/api/point/employee/6
Content-Type: application/json

{
  "value": 100,
  "type": "earn",
  "description": "Thưởng hoàn thành dự án",
  "actorId": 1
}

# Kết quả: Employee có 900 điểm
```

#### Test 2: Dùng điểm (REDEEM)
```bash
PUT http://localhost:5258/api/point/employee/6
Content-Type: application/json

{
  "value": 50,
  "type": "redeem",
  "description": "Đổi quà tặng",
  "actorId": 1
}

# Kết quả: Employee có 850 điểm (900 - 50)
```

#### Test 3: Điều chỉnh điểm (ADJUSTMENT)
```bash
PUT http://localhost:5258/api/point/employee/6
Content-Type: application/json

{
  "value": 1000,
  "type": "adjustment",
  "description": "Điều chỉnh điểm đầu năm",
  "actorId": 1
}

# Kết quả: Employee có đúng 1000 điểm
```

#### Test 4: Không có actorId (anonymous)
```bash
PUT http://localhost:5258/api/point/employee/6
Content-Type: application/json

{
  "value": 50,
  "type": "earn",
  "description": "Bonus tự động"
}

# actorId = null trong database
# Vẫn hoạt động bình thường
```

### Response thành công (200 OK)
```json
{
  "success": true,
  "message": "Cập nhật điểm thành công",
  "data": {
    "id": 6,
    "employeeId": 6,
    "employeeName": "Nguyen Van Emp1",
    "email": "emp1@company.com",
    "pointTotal": 1000,
    "lastUpdate": "2024-01-15T10:30:00Z"
  },
  "errors": null
}
```

### Response lỗi (400 Bad Request)
```json
{
  "success": false,
  "message": "Điểm không hợp lệ",
  "data": null,
  "errors": [
    "Tổng điểm không thể âm"
  ]
}
```

## 2. Test Xem điểm thưởng

### Endpoint
```
GET /api/point/employee/{employeeId}
```

### Ví dụ
```bash
GET http://localhost:5258/api/point/employee/6

# Response:
{
  "success": true,
  "message": "Lấy thông tin điểm thành công",
  "data": {
    "id": 6,
    "employeeId": 6,
    "employeeName": "Nguyen Van Emp1",
    "email": "emp1@company.com",
    "pointTotal": 800,
    "lastUpdate": "2024-01-15T10:30:00Z"
  }
}
```

## 3. Test Xem lịch sử giao dịch

### Endpoint
```
GET /api/point/transactions/employee/{employeeId}?limit=10
```

### Ví dụ
```bash
GET http://localhost:5258/api/point/transactions/employee/6?limit=10

# Response:
{
  "success": true,
  "message": "Lấy lịch sử giao dịch thành công",
  "data": [
    {
      "id": 1,
      "employeeId": 6,
      "employeeName": "Nguyen Van Emp1",
      "value": 1000,
      "type": "adjustment",
      "typeDisplay": "Điều chỉnh",
      "actorId": 1,
      "actorName": "Nguyen Van Admin",
      "description": "Điều chỉnh điểm đầu năm",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "employeeId": 6,
      "employeeName": "Nguyen Van Emp1",
      "value": 500,
      "type": "earn",
      "typeDisplay": "Thêm điểm",
      "actorId": 3,
      "actorName": "Le Van Manager1",
      "description": "Activity participation bonus",
      "createdAt": "2024-01-14T15:20:00Z"
    }
  ]
}
```

## 4. Test Quy đổi điểm sang tiền

### Bước 1: Xem quy tắc quy đổi hiện tại
```bash
GET http://localhost:5258/api/point/conversion-rules/active

# Response:
{
  "success": true,
  "data": {
    "id": 1,
    "pointValue": 100,
    "moneyValue": 50000,
    "isActive": true
  }
}

# Nghĩa là: 100 điểm = 50,000 VNĐ
```

### Bước 2: Gửi yêu cầu quy đổi
```bash
POST http://localhost:5258/api/point/employee/6/convert
Content-Type: application/json

{
  "pointRequested": 200
}

# Response:
{
  "success": true,
  "message": "Gửi yêu cầu quy đổi điểm thành công",
  "data": {
    "id": 1,
    "employeeId": 6,
    "employeeName": "Nguyen Van Emp1",
    "email": "emp1@company.com",
    "pointRequested": 200,
    "moneyReceived": 100000,
    "status": "pending",
    "statusDisplay": "Đang chờ",
    "createdAt": "2024-01-15T11:00:00Z",
    "processedAt": null
  }
}
```

### Bước 3: Duyệt yêu cầu quy đổi
```bash
PUT http://localhost:5258/api/point/conversion-history/1/process
Content-Type: application/json

{
  "status": "approved"
}

# Response:
{
  "success": true,
  "message": "Duyệt yêu cầu thành công",
  "data": {
    "id": 1,
    "employeeId": 6,
    "pointRequested": 200,
    "moneyReceived": 100000,
    "status": "approved",
    "statusDisplay": "Đã duyệt",
    "processedAt": "2024-01-15T11:05:00Z"
  }
}

# Điểm của employee sẽ bị trừ 200
```

## 5. Test bằng Swagger UI

1. Chạy project: `dotnet run`
2. Mở browser: `https://localhost:7183/swagger`
3. Chọn endpoint: `PUT /api/point/employee/{employeeId}`
4. Click "Try it out"
5. Nhập:
   - employeeId: `6`
   - Request body:
   ```json
   {
     "value": 100,
     "type": "earn",
     "description": "Test từ Swagger",
     "actorId": 1
   }
   ```
6. Click "Execute"
7. Xem Response ở dưới

## 6. Test bằng Postman

### Import Collection
Tạo file `PointAPI.postman_collection.json`:

```json
{
  "info": {
    "name": "Point Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Update Point - Earn",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"value\": 100,\n  \"type\": \"earn\",\n  \"description\": \"Bonus tháng 1\",\n  \"actorId\": 1\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/point/employee/6",
          "host": ["{{baseUrl}}"],
          "path": ["api", "point", "employee", "6"]
        }
      }
    },
    {
      "name": "Get Employee Point",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/api/point/employee/6",
          "host": ["{{baseUrl}}"],
          "path": ["api", "point", "employee", "6"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://localhost:7183"
    }
  ]
}
```

## 7. Validation Tests

### Test value ngoài range
```bash
PUT /api/point/employee/5
{
  "value": 20000,  # > 10000
  "type": "add",
  "actorId": 1
}

# Response 400:
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    "Giá trị điểm phải từ -10000 đến 10000"
  ]
}
```

### Test type không hợp lệ
```bash
{
  "value": 100,
  "type": "invalid",  # Phải là earn/redeem/adjustment
  "actorId": 1
}

# Response 400:
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    "Loại giao dịch phải là: earn (thêm điểm), redeem (dùng điểm), hoặc adjustment (điều chỉnh)"
  ]
}
```

### Test điểm âm
```bash
# Employee có 50 điểm, dùng 100 điểm
{
  "value": 100,
  "type": "redeem",
  "actorId": 1
}

# Response 400:
{
  "success": false,
  "message": "Điểm không hợp lệ",
  "errors": [
    "Tổng điểm không thể âm"
  ]
}
```

## 8. Kiểm tra Database sau khi test

```sql
-- Xem điểm hiện tại
SELECT e.id, e.fullname, p.point_total, p.last_update
FROM employee e
JOIN point p ON e.id = p.employee_id
WHERE e.id = 6;

-- Xem lịch sử giao dịch
SELECT 
    pth.created_at,
    e_target.fullname as employee,
    pth.value,
    pth.type,
    e_actor.fullname as actor,
    pth.description
FROM point_transaction_history pth
JOIN employee e_target ON pth.employee_id = e_target.id
LEFT JOIN employee e_actor ON pth.actor_id = e_actor.id
WHERE pth.employee_id = 6
ORDER BY pth.created_at DESC;
```

## 9. Integration với Java Auth Service

### Flow thực tế:
```
1. User login → Java Auth Service
2. Java trả về token + employeeId
3. Frontend gọi .NET API với actorId từ token
4. .NET API xử lý và lưu actorId vào DB
```

### Ví dụ Frontend call:
```javascript
// Sau khi login, lưu employeeId
const actorId = localStorage.getItem('employeeId'); // Từ Java Auth

// Gọi API update point
fetch('https://localhost:7183/api/point/employee/6', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token  // Token từ Java
  },
  body: JSON.stringify({
    value: 100,
    type: 'earn',
    description: 'Bonus',
    actorId: actorId  // Truyền từ client
  })
});
```