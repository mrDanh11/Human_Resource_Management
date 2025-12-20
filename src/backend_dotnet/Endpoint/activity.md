````md
# ACTIVITY & PARTICIPATION API TESTS

## Base Configuration

## 1. Lấy danh sách hoạt động (có filter)

```http
GET {{baseUrl}}/activity?pageNumber=1&pageSize=10&status=upcoming
Authorization: Bearer {{token}}
```

---

## 2. Lấy danh sách hoạt động (tìm kiếm)

```http
GET {{baseUrl}}/activity?pageNumber=1&pageSize=10&searchTerm=teambuilding
Authorization: Bearer {{token}}
```

---

## 3. Lấy danh sách hoạt động (theo thời gian)

```http
GET {{baseUrl}}/activity?fromDate=2024-01-01&toDate=2024-12-31
Authorization: Bearer {{token}}
```

---

## 4. Lấy chi tiết hoạt động theo ID

```http
GET {{baseUrl}}/activity/1
Authorization: Bearer {{token}}
```

---

## 5. Tạo hoạt động mới (HR/Admin)

```http
POST {{baseUrl}}/activity
Authorization: Bearer {{token}}
Content-Type: application/json
```

```json
{
  "name": "Teambuilding Q4 2024",
  "description": "Hoạt động teambuilding cuối năm tại Vũng Tàu",
  "startDate": "2024-12-20T08:00:00Z",
  "endDate": "2024-12-22T17:00:00Z",
  "registerDeadline": "2024-12-15T23:59:59Z",
  "maxParticipants": 50,
  "createdBy": 1
}
```

---

## 6. Cập nhật hoạt động (HR/Admin)

```http
PUT {{baseUrl}}/activity/1
Authorization: Bearer {{token}}
Content-Type: application/json
```

```json
{
  "name": "Teambuilding Q4 2024 - Updated",
  "description": "Hoạt động teambuilding cuối năm tại Đà Lạt (đã thay đổi)",
  "startDate": "2024-12-20T08:00:00Z",
  "endDate": "2024-12-22T17:00:00Z",
  "registerDeadline": "2024-12-15T23:59:59Z",
  "maxParticipants": 60,
  "status": "ongoing"
}
```

---

## 7. Hủy hoạt động (HR only)

```http
DELETE {{baseUrl}}/activity/1?reason=Thời tiết xấu, phải hoãn lại
Authorization: Bearer {{token}}
```

---

## 8. Lấy thống kê hoạt động

```http
GET {{baseUrl}}/activity/statistics
Authorization: Bearer {{token}}
```

---

# PARTICIPATION API TESTS

## 9. Lấy danh sách tham gia (tất cả)

```http
GET {{baseUrl}}/activity/participations?pageNumber=1&pageSize=20
Authorization: Bearer {{token}}
```

---

## 10. Lấy danh sách tham gia theo hoạt động

```http
GET {{baseUrl}}/activity/participations?activityId=1&pageNumber=1&pageSize=20
Authorization: Bearer {{token}}
```

---

## 11. Lấy danh sách tham gia theo nhân viên

```http
GET {{baseUrl}}/activity/participations?employeeId=5&pageNumber=1&pageSize=20
Authorization: Bearer {{token}}
```

---

## 12. Lấy danh sách tham gia theo kết quả

```http
GET {{baseUrl}}/activity/participations?result=excellent&pageNumber=1&pageSize=20
Authorization: Bearer {{token}}
```

---

## 13. Lấy chi tiết tham gia theo ID

```http
GET {{baseUrl}}/activity/participations/1
Authorization: Bearer {{token}}
```

---

## 14. Cập nhật kết quả tham gia (HR)

```http
PUT {{baseUrl}}/activity/participations/1/result
Authorization: Bearer {{token}}
Content-Type: application/json
```

```json
{
  "result": "excellent",
  "note": "Tham gia tích cực, thể hiện tinh thần đồng đội tốt"
}
```

---

## 15–19. Cập nhật kết quả theo mức đánh giá

### Xuất sắc

```json
{ "result": "excellent" }
```

### Tốt

```json
{ "result": "good" }
```

### Trung bình

```json
{ "result": "average" }
```

### Kém

```json
{ "result": "poor" }
```

### Vắng mặt

```json
{ "result": "absent" }
```

---

# TEST CASES – Validation

## 20. Tạo hoạt động với ngày không hợp lệ

```json
{
  "name": "Test Invalid Dates",
  "description": "Test",
  "startDate": "2024-12-20T08:00:00Z",
  "endDate": "2024-12-19T17:00:00Z",
  "registerDeadline": "2024-12-15T23:59:59Z",
  "maxParticipants": 50
}
```

---

## 21. Cập nhật kết quả với giá trị không hợp lệ

```json
{
  "result": "invalid_value"
}
```

---

## 22. Hủy hoạt động đã hoàn thành / không tồn tại

```http
DELETE {{baseUrl}}/activity/999?reason=Test
Authorization: Bearer {{token}}
```

---

## 23. Lấy hoạt động không tồn tại

```http
GET {{baseUrl}}/activity/999999
Authorization: Bearer {{token}}
```
```
