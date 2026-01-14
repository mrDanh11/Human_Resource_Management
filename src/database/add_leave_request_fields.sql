-- Add supporting columns for detailed leave requests
ALTER TABLE request 
ADD COLUMN duration DECIMAL(5, 2), -- Number of days (e.g., 0.5, 1.0, 2.5)
ADD COLUMN leave_mode VARCHAR(20), -- DAY, HALF_DAY, SHORT_HOUR
ADD COLUMN session VARCHAR(20);    -- MORNING, AFTERNOON

-- Add leave balance to employee
ALTER TABLE employee
ADD COLUMN annual_leave_balance DECIMAL(5, 2) DEFAULT 12.0;

-- Optional: Add a check constraint for leave_mode
ALTER TABLE request 
ADD CONSTRAINT check_leave_mode 
CHECK (leave_mode IN ('DAY', 'HALF_DAY', 'SHORT_HOUR'));


-- Bước 1: Xóa ràng buộc cũ
ALTER TABLE request DROP CONSTRAINT request_type_check;

-- Bước 2: Thêm ràng buộc mới bao gồm các giá trị Leave mới
ALTER TABLE request ADD CONSTRAINT request_type_check 
CHECK (type IN (
    'wfh', 'leave', 'overtime', 'attendance_correction', 'equipment', 'other',
    'LEAVE_ANNUAL', 'LEAVE_SICK', 'LEAVE_UNPAID', 'LEAVE_SATURDAY'
));

