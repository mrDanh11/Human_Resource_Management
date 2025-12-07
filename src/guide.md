## Config database
- Create .env file have params into folder: '/backend_java'
JWT_SECRET=mysecret_nguyenchidanh_mysecret_nguyenchidanh
DB_PASSWORD=123456

- Change port into appsetting.json file (/backend_dotnet/HRMApi/appsetting.json)
+ example:
Host=localhost;Port=5432;Database=hr_management;Username=postgres;Password=123456

## Run scripts 
- database_v0.sql
- seed_create_account.sql

## Run .net
- cd .\src\backend_dotnet\HRMApi\
    ``` dotnet run ```

## Run Java
- download JDK 17 (must have)
- cd .\src\backend_java 
    ``` ./mvnw spring-boot:run ```  <-- chạy lệnh này

### Login (have to run 'seed_create_account')
- username: admin
- password: 123456

- username: hr
- password: 123456

- username: manager
- password: 123456

- username: employee
- password: 123456



----------------------------
----------------------------
## Xác thực + Phân quyền proteted route (Backend)
* Với .net:
+ Thêm permission cho role:
    + Thêm trong file này (java):  \common\service\PermissionService.java
    + Thêm trong file này (.net): Program.cs (đoạn permission)
+ Protected route:
    + Vô Controller 
    + Trước 1 method cần xác thực/phân quyền thêm Annotation này: 
         [Authorize(Policy = "employee:list")]  --> dòng này có nghĩa là method đó chỉ cho phép được gọi ghi user có quyền(permission là "employee:list" này thôi) -> cái permission này phải thêm ở 2 file kia trước mới được (must) 
    + Xong.