# Avatar Samples

Folder này chứa các avatar mẫu cho demo:

- admin.jpg - Avatar cho admin
- hr_manager.jpg - Avatar cho HR manager
- manager.jpg - Avatar cho department manager
- employee.jpg - Avatar cho nhân viên

Các file ảnh sẽ được đặt tại đây và tham chiếu qua tên file trong database hoặc API.

## Usage
```typescript
// Chỉ cần truyền tên file
<Avatar src="admin.jpg" name="Admin User" />

// Hoặc đường dẫn đầy đủ
<Avatar src="/src/assets/avatar/admin.jpg" name="Admin User" />
```