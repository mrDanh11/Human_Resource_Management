# Hướng Dẫn Test Participation API với Postman

## 📋 Tổng Quan Chức Năng

Hệ thống Participation quản lý việc nhân viên tham gia các hoạt động và ghi nhận kết quả. Bao gồm:

### Các Chức Năng Chính:
1. ✅ Xem danh sách hoạt động mà nhân viên tham gia
2. ✅ Xem danh sách nhân viên tham gia một hoạt động
3. ✅ Xem chi tiết thông tin tham gia
4. ✅ Xem tất cả participation (có phân trang, tìm kiếm)
5. ✅ **Cập nhật kết quả tham gia** (JSONB)
6. ✅ Xem kết quả theo loại hoạt động

### Các Loại Hoạt động Hỗ Trợ Ghi Nhận Kết Quả:
1. **Sports** (Thể thao)
   - Running (Chạy bộ)
   - Swimming (Bơi lội)
2. **Training** (Đào tạo)
3. **Volunteer** (Tình nguyện)
4. **Team Building** (Xây dựng đội nhóm)

---

## 🔧 Cấu Hình Postman

### Environment Variables
Tạo environment trong Postman với các biến:

```
base_url: https://localhost:7183
access_token: your_jwt_token_here
employee_id: 1
activity_id: 1
```

### Headers Mặc Định
Mọi request đều cần:
```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

---

## 📍 API Endpoints và Test Cases

### 1. Lấy Danh Sách Hoạt Động Của Nhân Viên

**Endpoint:**
```
GET {{base_url}}/api/v1/Participation/employee/{employeeId}
```

**Authorization:** `participate:list`

**Test Case 1: Lấy hoạt động của nhân viên ID 1**
```
GET {{base_url}}/api/v1/Participation/employee/1
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Lấy thông tin tham gia thành công",
  "data": [
    {
      "id": 1,
      "employeeId": 1,
      "activityId": 5,
      "employeeName": "Nguyễn Văn A",
      "activityName": "Marathon 2024",
      "description": "Giải chạy marathon thường niên",
      "registerDate": "2024-01-15T08:00:00Z",
      "cancelDate": null,
      "status": "attended",
      "result": {
        "time": "03:45:30",
        "distanceKm": 42.195,
        "rank": 15,
        "pacePerKm": "05:20"
      }
    }
  ]
}
```

**Test Case 2: Nhân viên không tồn tại**
```
GET {{base_url}}/api/v1/Participation/employee/999999
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Không tìm thấy nhân viên",
  "data": null,
  "errors": ["Nhân viên với ID 999999 không tồn tại"]
}
```

---

### 2. Lấy Danh Sách Nhân Viên Tham Gia Hoạt Động

**Endpoint:**
```
GET {{base_url}}/api/v1/Participation/activity/{activityId}
```

**Authorization:** `participate:list`

**Test Case 1: Lấy danh sách nhân viên tham gia hoạt động ID 5**
```
GET {{base_url}}/api/v1/Participation/activity/5
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Lấy thông tin tham gia thành công",
  "data": [
    {
      "id": 1,
      "employeeId": 1,
      "activityId": 5,
      "employeeName": "Nguyễn Văn A",
      "activityName": "Marathon 2024",
      "description": "Giải chạy marathon thường niên",
      "registerDate": "2024-01-15T08:00:00Z",
      "status": "attended",
      "result": { "time": "03:45:30", "rank": 15 }
    },
    {
      "id": 2,
      "employeeId": 3,
      "activityId": 5,
      "employeeName": "Trần Thị B",
      "activityName": "Marathon 2024",
      "status": "registered",
      "result": null
    }
  ]
}
```

---

### 3. Xem Chi Tiết Một Participation

**Endpoint:**
```
GET {{base_url}}/api/v1/Participation/{activityId}-{employeeId}
```

**Authorization:** `participate:view`

**Test Case 1: Xem participation cụ thể**
```
GET {{base_url}}/api/v1/Participation/5-1
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Lấy thông tin tham gia thành công",
  "data": {
    "id": 1,
    "employeeId": 1,
    "activityId": 5,
    "employeeName": "Nguyễn Văn A",
    "activityName": "Marathon 2024",
    "description": "Giải chạy marathon thường niên",
    "registerDate": "2024-01-15T08:00:00Z",
    "cancelDate": null,
    "status": "attended",
    "result": {
      "time": "03:45:30",
      "distanceKm": 42.195,
      "rank": 15,
      "pacePerKm": "05:20",
      "note": "Thời tiết tốt, hoàn thành xuất sắc"
    }
  }
}
```

---

### 4. Lấy Tất Cả Participations (Phân Trang)

**Endpoint:**
```
GET {{base_url}}/api/v1/Participation?pageNumber={page}&pageSize={size}&searchTerm={search}
```

**Authorization:** `participate:list`

**Test Case 1: Lấy trang đầu tiên, 10 items**
```
GET {{base_url}}/api/v1/Participation?pageNumber=1&pageSize=10
```

**Test Case 2: Tìm kiếm theo tên nhân viên**
```
GET {{base_url}}/api/v1/Participation?pageNumber=1&pageSize=10&searchTerm=Nguyễn
```

**Response Success (200):**
```json
{
  "items": [
    {
      "id": 1,
      "employeeId": 1,
      "activityId": 5,
      "employeeName": "Nguyễn Văn A",
      "activityName": "Marathon 2024",
      "status": "attended",
      "result": { "time": "03:45:30" }
    }
  ],
  "totalCount": 45,
  "pageNumber": 1,
  "pageSize": 10,
  "totalPages": 5,
  "hasPreviousPage": false,
  "hasNextPage": true
}
```

---

### 5. ⭐ CẬP NHẬT KẾT QUẢ THAM GIA (JSONB)

**Endpoint:**
```
PUT {{base_url}}/api/v1/Participation/{activityId}-{employeeId}/result
```

**Authorization:** `participate:update`

---

#### 5.1. Kết Quả RUNNING (Chạy Bộ)

**Test Case: Cập nhật kết quả chạy marathon**
```
PUT {{base_url}}/api/v1/Participation/5-1/result
Content-Type: application/json

{
  "resultData": {
    "time": "03:45:30",
    "distanceKm": 42.195,
    "rank": 15,
    "pacePerKm": "05:20",
    "note": "Hoàn thành tốt trong điều kiện thời tiết nắng nóng"
  }
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Cập nhật kết quả thành công",
  "data": {
    "id": 1,
    "employeeId": 1,
    "activityId": 5,
    "employeeName": "Nguyễn Văn A",
    "activityName": "Marathon 2024",
    "status": "attended",
    "result": {
      "time": "03:45:30",
      "distanceKm": 42.195,
      "rank": 15,
      "pacePerKm": "05:20",
      "note": "Hoàn thành tốt trong điều kiện thời tiết nắng nóng"
    }
  }
}
```

---

#### 5.2. Kết Quả SWIMMING (Bơi Lội)

**Test Case: Cập nhật kết quả bơi lội**
```
PUT {{base_url}}/api/v1/Participation/8-3/result
Content-Type: application/json

{
  "resultData": {
    "style": "freestyle",
    "distanceM": 1500,
    "time": "00:18:45",
    "rank": 3,
    "note": "Giải nhất cự ly 1500m bơi tự do"
  }
}
```

**Các style hợp lệ:** `freestyle`, `backstroke`, `breaststroke`, `butterfly`

---

#### 5.3. Kết Quả TRAINING (Đào Tạo)

**Test Case: Cập nhật kết quả khóa đào tạo**
```
PUT {{base_url}}/api/v1/Participation/12-5/result
Content-Type: application/json

{
  "resultData": {
    "attendanceHours": 40,
    "quizScore": 95,
    "certificateIssued": true,
    "completionDate": "2024-12-20T00:00:00Z",
    "feedback": "Học viên xuất sắc, tích cực tham gia thảo luận"
  }
}
```

---

#### 5.4. Kết Quả VOLUNTEER (Tình Nguyện)

**Test Case: Cập nhật kết quả hoạt động tình nguyện**
```
PUT {{base_url}}/api/v1/Participation/15-2/result
Content-Type: application/json

{
  "resultData": {
    "hoursContributed": 16.5,
    "tasksCompleted": [
      "Phát quà cho trẻ em vùng cao",
      "Dọn dẹp khu vực trường học",
      "Hỗ trợ xây dựng nhà cho người nghèo"
    ],
    "impact": "Đã hỗ trợ 50 gia đình khó khăn",
    "recognition": "Giấy khen tình nguyện viên xuất sắc"
  }
}
```

---

#### 5.5. Kết Quả TEAM BUILDING

**Test Case: Cập nhật kết quả team building**
```
PUT {{base_url}}/api/v1/Participation/18-7/result
Content-Type: application/json

{
  "resultData": {
    "teamName": "Dream Team",
    "teamRank": 2,
    "activitiesCompleted": [
      "Trò chơi trí tuệ",
      "Leo núi thách thức",
      "Nấu ăn tập thể",
      "Giải câu đố"
    ],
    "pointsEarned": 850,
    "note": "Đội đạt giải nhì, tinh thần đồng đội tốt"
  }
}
```

---

#### 5.6. Test Cases Lỗi

**Test Case: Cập nhật khi chưa attended**
```
PUT {{base_url}}/api/v1/Participation/5-1/result
{
  "resultData": { "time": "03:45:30" }
}
```

**Response Error (400/404):**
```json
{
  "success": false,
  "message": "Không thể cập nhật kết quả",
  "errors": ["Chỉ có thể cập nhật kết quả cho hoạt động đã tham gia (status = 'attended')"]
}
```

**Test Case: Participation không tồn tại**
```
PUT {{base_url}}/api/v1/Participation/999-999/result
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Không tìm thấy thông tin tham gia",
  "errors": ["Không tồn tại bản ghi tham gia này"]
}
```

---

### 6. Lấy Kết Quả Theo Loại Hoạt Động

**Endpoint:**
```
GET {{base_url}}/api/v1/Participation/results/by-type/{activityType}
```

**Authorization:** `participate:list`

**Test Case 1: Lấy kết quả sports**
```
GET {{base_url}}/api/v1/Participation/results/by-type/sports
```

**Test Case 2: Lấy kết quả training**
```
GET {{base_url}}/api/v1/Participation/results/by-type/training
```

**Test Case 3: Lấy kết quả volunteer**
```
GET {{base_url}}/api/v1/Participation/results/by-type/volunteer
```

**Test Case 4: Lấy kết quả team_building**
```
GET {{base_url}}/api/v1/Participation/results/by-type/team_building
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Lấy 15 kết quả thành công",
  "data": [
    {
      "id": 1,
      "employeeId": 1,
      "activityId": 5,
      "employeeName": "Nguyễn Văn A",
      "activityName": "Marathon 2024",
      "status": "attended",
      "result": {
        "time": "03:45:30",
        "distanceKm": 42.195,
        "rank": 15
      }
    }
  ]
}
```

---

## 🧪 Postman Collection

### Import Collection JSON

Tạo file `Participation_API.postman_collection.json`:

```json
{
  "info": {
    "name": "Participation API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Get Employee Participations",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{access_token}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/v1/Participation/employee/{{employee_id}}",
          "host": ["{{base_url}}"],
          "path": ["api", "v1", "Participation", "employee", "{{employee_id}}"]
        }
      }
    },
    {
      "name": "2. Get Activity Participants",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{access_token}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/v1/Participation/activity/{{activity_id}}",
          "host": ["{{base_url}}"],
          "path": ["api", "v1", "Participation", "activity", "{{activity_id}}"]
        }
      }
    },
    {
      "name": "3. Get Participation Detail",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{access_token}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/v1/Participation/{{activity_id}}-{{employee_id}}",
          "host": ["{{base_url}}"],
          "path": ["api", "v1", "Participation", "{{activity_id}}-{{employee_id}}"]
        }
      }
    },
    {
      "name": "4. Get All Participations",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{access_token}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/v1/Participation?pageNumber=1&pageSize=10",
          "host": ["{{base_url}}"],
          "path": ["api", "v1", "Participation"],
          "query": [
            {"key": "pageNumber", "value": "1"},
            {"key": "pageSize", "value": "10"},
            {"key": "searchTerm", "value": "", "disabled": true}
          ]
        }
      }
    },
    {
      "name": "5.1. Update Result - Running",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{access_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"resultData\": {\n    \"time\": \"03:45:30\",\n    \"distanceKm\": 42.195,\n    \"rank\": 15,\n    \"pacePerKm\": \"05:20\",\n    \"note\": \"Great performance\"\n  }\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/v1/Participation/{{activity_id}}-{{employee_id}}/result",
          "host": ["{{base_url}}"],
          "path": ["api", "v1", "Participation", "{{activity_id}}-{{employee_id}}", "result"]
        }
      }
    },
    {
      "name": "5.2. Update Result - Swimming",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{access_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"resultData\": {\n    \"style\": \"freestyle\",\n    \"distanceM\": 1500,\n    \"time\": \"00:18:45\",\n    \"rank\": 3,\n    \"note\": \"Excellent\"\n  }\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/v1/Participation/{{activity_id}}-{{employee_id}}/result",
          "host": ["{{base_url}}"],
          "path": ["api", "v1", "Participation", "{{activity_id}}-{{employee_id}}", "result"]
        }
      }
    },
    {
      "name": "5.3. Update Result - Training",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{access_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"resultData\": {\n    \"attendanceHours\": 40,\n    \"quizScore\": 95,\n    \"certificateIssued\": true,\n    \"completionDate\": \"2024-12-20T00:00:00Z\",\n    \"feedback\": \"Outstanding student\"\n  }\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/v1/Participation/{{activity_id}}-{{employee_id}}/result",
          "host": ["{{base_url}}"],
          "path": ["api", "v1", "Participation", "{{activity_id}}-{{employee_id}}", "result"]
        }
      }
    },
    {
      "name": "5.4. Update Result - Volunteer",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{access_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"resultData\": {\n    \"hoursContributed\": 16.5,\n    \"tasksCompleted\": [\"Task 1\", \"Task 2\", \"Task 3\"],\n    \"impact\": \"Helped 50 families\",\n    \"recognition\": \"Certificate of Excellence\"\n  }\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/v1/Participation/{{activity_id}}-{{employee_id}}/result",
          "host": ["{{base_url}}"],
          "path": ["api", "v1", "Participation", "{{activity_id}}-{{employee_id}}", "result"]
        }
      }
    },
    {
      "name": "5.5. Update Result - Team Building",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{access_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"resultData\": {\n    \"teamName\": \"Dream Team\",\n    \"teamRank\": 2,\n    \"activitiesCompleted\": [\"Activity 1\", \"Activity 2\"],\n    \"pointsEarned\": 850,\n    \"note\": \"Great teamwork\"\n  }\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/v1/Participation/{{activity_id}}-{{employee_id}}/result",
          "host": ["{{base_url}}"],
          "path": ["api", "v1", "Participation", "{{activity_id}}-{{employee_id}}", "result"]
        }
      }
    },
    {
      "name": "6. Get Results by Type - Sports",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{access_token}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/v1/Participation/results/by-type/sports",
          "host": ["{{base_url}}"],
          "path": ["api", "v1", "Participation", "results", "by-type", "sports"]
        }
      }
    }
  ]
}
```

---

## ✅ Checklist Test Đầy Đủ

### Setup
- [ ] Import Postman Collection
- [ ] Cấu hình Environment (base_url, access_token)
- [ ] Lấy JWT token từ API authentication

### Test Các Endpoint
- [ ] GET employee participations (success)
- [ ] GET employee participations (employee not found)
- [ ] GET activity participants (success)
- [ ] GET participation detail (success)
- [ ] GET all participations with pagination
- [ ] GET all participations with search

### Test Cập Nhật Kết Quả (5 loại)
- [ ] Update Running result
- [ ] Update Swimming result
- [ ] Update Training result
- [ ] Update Volunteer result
- [ ] Update Team Building result

### Test Error Cases
- [ ] Update result khi status != 'attended'
- [ ] Update result không tồn tại
- [ ] Update với dữ liệu không hợp lệ

### Test Query Results
- [ ] Get results by type: sports
- [ ] Get results by type: training
- [ ] Get results by type: volunteer
- [ ] Get results by type: team_building

---

## 📊 Dữ Liệu Mẫu Để Test

### Bước 1: Tạo Activity
Trước khi test, cần có dữ liệu activity trong database:

```sql
-- Sports Activity (Running)
INSERT INTO activity (name, description, start_date, end_date, register_deadline, 
                      max_participants, status, activity_type, created_by)
VALUES ('Marathon 2024', 'Giải chạy marathon thường niên', 
        '2024-06-01', '2024-06-01', '2024-05-25', 
        100, 'completed', 'sports', 1);

-- Training Activity
INSERT INTO activity (name, description, start_date, end_date, register_deadline, 
                      max_participants, status, activity_type, created_by)
VALUES ('Khóa đào tạo .NET', 'Khóa đào tạo lập trình .NET Core', 
        '2024-07-01', '2024-07-31', '2024-06-25', 
        30, 'completed', 'training', 1);

-- Volunteer Activity
INSERT INTO activity (name, description, start_date, end_date, register_deadline, 
                      max_participants, status, activity_type, created_by)
VALUES ('Tình nguyện vùng cao', 'Hoạt động từ thiện tại vùng cao', 
        '2024-08-01', '2024-08-03', '2024-07-25', 
        20, 'completed', 'volunteer', 1);
```

### Bước 2: Tạo Participation
```sql
-- Employee 1 tham gia Marathon (status attended để có thể update result)
INSERT INTO participation (employee_id, activity_id, register_date, status)
VALUES (1, 1, NOW(), 'attended');

-- Employee 2 tham gia Training
INSERT INTO participation (employee_id, activity_id, register_date, status)
VALUES (2, 2, NOW(), 'attended');
```

---

## 🎯 Kết Luận

**Các loại hoạt động có ghi nhận kết quả:**
1. ✅ **Sports** (Running, Swimming)
2. ✅ **Training**
3. ✅ **Volunteer**
4. ✅ **Team Building**

**Tổng cộng: 5 loại kết quả được hỗ trợ**

Mỗi loại có cấu trúc dữ liệu riêng được lưu trong JSONB field `result` của bảng `participation`.