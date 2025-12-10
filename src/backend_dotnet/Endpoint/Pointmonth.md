## API Endpoints

### 1. Xem quy tắc cộng điểm

```bash
GET /api/monthlypoint/rules

# Response:
{
  "success": true,
  "message": "Lấy danh sách quy tắc thành công",
  "data": [
    {
      "id": 1,
      "roleId": 1,
      "roleName": "admin",
      "pointValue": 200,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": 4,
      "roleId": 4,
      "roleName": "employee",
      "pointValue": 100,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 2. Tạo/Cập nhật quy tắc

```bash
POST /api/monthlypoint/rules
Content-Type: application/json

{
  "roleId": 4,
  "pointValue": 120,
  "isActive": true
}

# Response:
{
  "success": true,
  "message": "Cập nhật quy tắc thành công",
  "data": {
    "id": 4,
    "roleId": 4,
    "pointValue": 120,
    "isActive": true
  }
}
```

**Lưu ý:** Mỗi role chỉ có **1 quy tắc duy nhất**. Nếu đã tồn tại sẽ **update**, chưa có sẽ **tạo mới**.

### 3. Chạy job thủ công (Manual Trigger)

```bash
POST /api/monthlypoint/allocate

# Response thành công:
{
  "success": true,
  "message": "Đã cộng điểm thành công cho 10 nhân viên, tổng 1200 điểm",
  "data": {
    "employeesProcessed": 10,
    "pointsAllocated": 1200
  }
}

# Response nếu đã chạy rồi:
{
  "success": false,
  "message": "Đã chạy job cộng điểm cho tháng 12/2024 rồi",
  "errors": []
}
```

**Khi nào dùng?**
- Test xem job có hoạt động không
- Cộng điểm sớm (không đợi đến ngày 1)
- Fix lỗi nếu job tự động bị lỗi

### 4. Xem lịch sử thực thi

```bash
GET /api/monthlypoint/history?limit=12

# Response:
{
  "success": true,
  "message": "Lấy lịch sử thành công",
  "data": [
    {
      "id": 1,
      "executionDate": "2024-12-01T00:00:05Z",
      "year": 2024,
      "month": 12,
      "totalEmployeesProcessed": 10,
      "totalPointsAllocated": 1200,
      "status": "completed",
      "errorMessage": null
    },
    {
      "id": 2,
      "executionDate": "2024-11-01T00:00:03Z",
      "year": 2024,
      "month": 11,
      "totalEmployeesProcessed": 10,
      "totalPointsAllocated": 1200,
      "status": "completed",
      "errorMessage": null
    }
  ]
}
```

---

## Background Service

### Cách hoạt động

**MonthlyPointAllocationWorker** chạy như một Background Service:

1. **Khởi động:** Tính toán thời gian đến lần chạy tiếp theo (ngày 1 tháng sau)
2. **Chạy hàng ngày:** Kiểm tra:
   - Có phải ngày 1 không?
   - Đã chạy trong tháng này chưa?
3. **Thực thi:** Nếu đủ điều kiện → Cộng điểm tự động
4. **Ghi log:** Lưu kết quả vào `monthly_point_allocation_history`

### Xem logs

```bash
# Trong console khi chạy dotnet run
[12:00:00 INF] Monthly Point Allocation Worker is starting
[12:00:00 INF] Next monthly point allocation will run at 01/01/2025 00:00:00 UTC
[01/01/2025 00:00:05 INF] Running monthly point allocation job
[01/01/2025 00:00:06 INF] Monthly point allocation completed successfully: Đã cộng điểm thành công cho 10 nhân viên, tổng 1200 điểm
```

---

## Quy trình cộng điểm tự động

### 1. Điều kiện để chạy:
- ✅ Là ngày 1 hàng tháng
- ✅ Chưa chạy trong tháng hiện tại
- ✅ Có ít nhất 1 quy tắc `is_active = true`
- ✅ Có nhân viên `status = 'active'`

### 2. Các bước thực hiện:

```
1. Lấy tất cả quy tắc active
2. Lấy tất cả nhân viên active
3. Với mỗi nhân viên:
   - Tìm quy tắc của role
   - Cộng điểm vào bảng `point`
   - Tạo record trong `point_transaction_history`
4. Lưu vào `monthly_point_allocation_history`
```

### 3. Transaction History

Mỗi lần cộng điểm sẽ tạo record:

```sql
type = 'earn'
actor_id = NULL (system-generated)
description = 'Điểm thưởng tháng 12/2024 cho role employee'
```

---

## Use Cases

### Case 1: Cấu hình lần đầu

```bash
# 1. Xem quy tắc hiện tại
GET /api/monthlypoint/rules

# 2. Cập nhật nếu cần
POST /api/monthlypoint/rules
{
  "roleId": 4,
  "pointValue": 150,  # Thay đổi từ 100 → 150
  "isActive": true
}

# 3. Test chạy thử
POST /api/monthlypoint/allocate

# 4. Kiểm tra kết quả
GET /api/point/transactions?type=earn&fromDate=2024-12-01
```

### Case 2: Tắt auto cộng điểm tạm thời

```bash
# Tắt tất cả quy tắc
POST /api/monthlypoint/rules
{
  "roleId": 1,
  "pointValue": 200,
  "isActive": false  # Set false
}

# Làm tương tự cho các role khác
```

### Case 3: Fix lỗi nếu job bị skip

```bash
# Nếu ngày 1 job không chạy (server down...)
# Có thể chạy thủ công bất cứ lúc nào:
POST /api/monthlypoint/allocate

# Hệ thống vẫn check xem đã chạy trong tháng chưa
# Nên không lo bị duplicate
```

### Case 4: Thay đổi quy tắc giữa tháng

```bash
# Tháng 12: Cộng 100 điểm cho employee
# Ngày 15/12: Thay đổi thành 150 điểm

POST /api/monthlypoint/rules
{
  "roleId": 4,
  "pointValue": 150,
  "isActive": true
}

# Thay đổi chỉ áp dụng từ tháng 1/2025
# Nhân viên đã nhận 100 điểm tháng 12 không bị ảnh hưởng
```

---

## Kiểm tra trong Database

### Xem nhân viên được cộng điểm

```sql
SELECT 
    e.id,
    e.fullname,
    r.name as role,
    p.point_total,
    p.last_update
FROM employee e
JOIN role r ON e.role_id = r.id
JOIN point p ON e.id = p.employee_id
WHERE e.status = 'active'
ORDER BY r.id, e.id;
```

### Xem lịch sử cộng điểm tự động

```sql
SELECT 
    pth.created_at,
    e.fullname,
    r.name as role,
    pth.value,
    pth.description
FROM point_transaction_history pth
JOIN employee e ON pth.employee_id = e.id
JOIN role r ON e.role_id = r.id
WHERE pth.type = 'earn' 
  AND pth.actor_id IS NULL  -- System-generated
  AND pth.description LIKE 'Điểm thưởng tháng%'
ORDER BY pth.created_at DESC
LIMIT 20;
```

### Xem tổng điểm đã cộng theo tháng

```sql
SELECT 
    year,
    month,
    total_employees_processed,
    total_points_allocated,
    status,
    execution_date
FROM monthly_point_allocation_history
ORDER BY year DESC, month DESC;
```

---

## Troubleshooting

### Job không chạy vào ngày 1?

**Check logs:**
```bash
# Tìm trong logs
grep "Monthly Point Allocation" logs/*.log
```

**Kiểm tra:**
1. Background Service có được đăng ký? → Check Program.cs
2. Server có chạy liên tục không? → Cần server 24/7
3. Đã chạy rồi trong tháng? → Check `monthly_point_allocation_history`

### Chạy thủ công bị lỗi "Đã chạy job rồi"?

```sql
-- Xem lịch sử
SELECT * FROM monthly_point_allocation_history 
WHERE year = 2024 AND month = 12;

-- Nếu muốn chạy lại (cẩn thận!)
DELETE FROM monthly_point_allocation_history 
WHERE year = 2024 AND month = 12;

-- Sau đó chạy lại API
POST /api/monthlypoint/allocate
```

### Một số nhân viên không được cộng điểm?

**Nguyên nhân:**
- Employee có `status != 'active'` → Chỉ cộng cho active
- Role không có quy tắc → Check `monthly_point_rules`
- Quy tắc bị `is_active = false` → Enable lại

**Fix:**
```sql
-- Xem nhân viên không có quy tắc
SELECT 
    e.id,
    e.fullname,
    r.name as role,
    e.status
FROM employee e
JOIN role r ON e.role_id = r.id
LEFT JOIN monthly_point_rules mpr ON e.role_id = mpr.role_id
WHERE e.status = 'active' 
  AND (mpr.id IS NULL OR mpr.is_active = false);
```

---

