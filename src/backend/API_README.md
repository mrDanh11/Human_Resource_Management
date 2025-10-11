# Human Resource Management System - Backend API

## Cấu trúc dự án Spring Boot

```
src/main/java/com/group07/human_resource_management/
├── HumanResourceManagementApplication.java    # Main class
├── controller/                                # REST Controllers
│   ├── HelloController.java                  # Hello World API
│   └── EmployeeController.java               # Employee CRUD API
├── service/                                   # Business Logic
│   └── EmployeeService.java
├── repository/                                # Data Access Layer
│   └── EmployeeRepository.java
├── model/                                     # Entity Classes
│   └── Employee.java
├── dto/                                       # Data Transfer Objects
│   └── EmployeeDTO.java
├── config/                                    # Configuration Classes
│   └── SecurityConfig.java
├── exception/                                 # Exception Handling
│   ├── ErrorResponse.java
│   └── GlobalExceptionHandler.java
└── util/                                      # Utility Classes
```

## Cách chạy ứng dụng

### 1. Chuẩn bị Database
- Cài đặt PostgreSQL
- Tạo database: `hr_management_db`
- Cập nhật thông tin database trong `application.properties`

### 2. Chạy ứng dụng
```bash
# Sử dụng Maven Wrapper
./mvnw spring-boot:run

# Hoặc trên Windows
mvnw.cmd spring-boot:run
```

### 3. Test API

#### Hello World APIs:
- **GET** `http://localhost:8080/api/v1/hello`
- **GET** `http://localhost:8080/api/v1/hello/{name}`
- **POST** `http://localhost:8080/api/v1/hello`

#### Employee APIs:
- **GET** `http://localhost:8080/api/v1/employees` - Lấy tất cả nhân viên
- **GET** `http://localhost:8080/api/v1/employees/{id}` - Lấy nhân viên theo ID
- **POST** `http://localhost:8080/api/v1/employees` - Tạo nhân viên mới
- **PUT** `http://localhost:8080/api/v1/employees/{id}` - Cập nhật nhân viên
- **DELETE** `http://localhost:8080/api/v1/employees/{id}` - Xóa nhân viên
- **GET** `http://localhost:8080/api/v1/employees/department/{department}` - Lấy nhân viên theo phòng ban

## Ví dụ sử dụng API

### 1. Test Hello World API
```bash
curl -X GET http://localhost:8080/api/v1/hello
```

### 2. Tạo Employee mới
```bash
curl -X POST http://localhost:8080/api/v1/employees \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Nguyen",
    "lastName": "Van A",
    "email": "nguyenvana@company.com",
    "phoneNumber": "0123456789",
    "department": "IT",
    "position": "Developer"
  }'
```

### 3. Lấy tất cả Employee
```bash
curl -X GET http://localhost:8080/api/v1/employees
```

## Dependencies sử dụng
- Spring Boot Web
- Spring Boot Data JPA
- Spring Boot Security
- Spring Boot Validation
- PostgreSQL Driver
- Lombok
- Spring Boot DevTools

## Ghi chú
- Database sẽ tự động tạo bảng khi chạy lần đầu (hibernate.ddl-auto=update)
- CORS đã được cấu hình để cho phép tất cả origins
- Security đã được cấu hình để cho phép truy cập tự do vào `/api/**`
- Validation đã được thiết lập cho DTO
- Global Exception Handler đã được cấu hình
