-- ============================================
-- HR MANAGEMENT SYSTEM - FULL DATABASE RESET
-- ============================================

-- 1. DROP ALL TABLES (Clean Slate)
DROP TABLE IF EXISTS monthly_point_allocation_history CASCADE;
DROP TABLE IF EXISTS monthly_point_rules CASCADE;
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS user_accounts CASCADE;
DROP TABLE IF EXISTS approval_history CASCADE;
DROP TABLE IF EXISTS request CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS point_to_money_history CASCADE;
DROP TABLE IF EXISTS point_conversion_rules CASCADE;
DROP TABLE IF EXISTS point_transaction_history CASCADE;
DROP TABLE IF EXISTS point CASCADE;
DROP TABLE IF EXISTS participation CASCADE;
DROP TABLE IF EXISTS activity CASCADE;
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS department CASCADE;
DROP TABLE IF EXISTS role CASCADE;

-- 2. CREATE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 3. CREATE TABLES (Schema)

-- ROLE
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DEPARTMENT
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    manager_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- EMPLOYEE
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    cccd VARCHAR(12) UNIQUE NOT NULL,
    tax_code VARCHAR(13) UNIQUE,
    phone VARCHAR(15),
    address TEXT,
    bank_account VARCHAR(50),
    join_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    birthday DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    email VARCHAR(100) UNIQUE NOT NULL,
    role_id INTEGER NOT NULL,
    department_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

ALTER TABLE department 
ADD CONSTRAINT fk_department_manager 
FOREIGN KEY (manager_id) REFERENCES employee(id);

-- USER ACCOUNTS
CREATE TABLE user_accounts (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- REFRESH TOKENS
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_revoked BOOLEAN DEFAULT false,
    revoked_at TIMESTAMP,
    device_info TEXT,
    ip_address INET,
    FOREIGN KEY (user_id) REFERENCES user_accounts(id) ON DELETE CASCADE
);

-- PASSWORD RESET TOKENS
CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_accounts(id) ON DELETE CASCADE
);

-- POINT
CREATE TABLE point (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL UNIQUE,
    point_total INTEGER DEFAULT 0 CHECK (point_total >= 0),
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- POINT TRANSACTION HISTORY
CREATE TABLE point_transaction_history (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    value INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('earn', 'redeem', 'transfer', 'adjustment')),
    actor_id INTEGER,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(id),
    FOREIGN KEY (actor_id) REFERENCES employee(id)
);

-- POINT CONVERSION RULES
CREATE TABLE point_conversion_rules (
    id SERIAL PRIMARY KEY,
    point_value INTEGER NOT NULL,
    money_value DECIMAL(15,2) NOT NULL,
    updated_by INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (updated_by) REFERENCES employee(id)
);

-- POINT TO MONEY HISTORY
CREATE TABLE point_to_money_history (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    point_requested INTEGER NOT NULL,
    money_received DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(id)
);

-- ACTIVITY
CREATE TABLE activity (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    registration_start_date TIMESTAMP NOT NULL, 
    registration_end_date TIMESTAMP NOT NULL,   
    max_participants INTEGER,
    location VARCHAR(255),
    activity_type VARCHAR(50) CHECK (activity_type IN ('sports', 'charity', 'training', 'team-building', 'volunteer')),
    image_url TEXT,
    organizer VARCHAR(100), 
    points INTEGER DEFAULT 0, 
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES employee(id)
);

-- PARTICIPATION
CREATE TABLE participation (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    activity_id INTEGER NOT NULL,
    register_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancel_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled', 'attended', 'absent')),
    result TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(id),
    FOREIGN KEY (activity_id) REFERENCES activity(id),
    UNIQUE(employee_id, activity_id)
);

-- ATTENDANCE
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    date DATE NOT NULL,
    checkin_time TIMESTAMP,
    checkout_time TIMESTAMP,
    status VARCHAR(20) DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'half_day', 'wfh')),
    attachment TEXT,
    work_hours DECIMAL(5,2),
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(id),
    UNIQUE(employee_id, date)
);

-- REQUEST
CREATE TABLE request (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    type VARCHAR(50) NOT NULL CHECK (type IN ('wfh', 'leave', 'overtime', 'attendance_correction', 'equipment', 'other')),
    attachment TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(id)
);

-- APPROVAL HISTORY
CREATE TABLE approval_history (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL,
    approver_id INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('approved', 'rejected')),
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES request(id),
    FOREIGN KEY (approver_id) REFERENCES employee(id)
);

-- MONTHLY POINT RULES
CREATE TABLE monthly_point_rules (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL,
    point_value INTEGER NOT NULL CHECK (point_value >= 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES role(id),
    UNIQUE(role_id)
);

-- MONTHLY POINT ALLOCATION HISTORY
CREATE TABLE monthly_point_allocation_history (
    id SERIAL PRIMARY KEY,
    execution_date TIMESTAMP NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    total_employees_processed INTEGER DEFAULT 0,
    total_points_allocated INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'failed', 'partial')),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(year, month)
);

-- 4. CREATE TRIGGERS & FUNCTIONS

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employee_updated_at BEFORE UPDATE ON employee
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_accounts_updated_at BEFORE UPDATE ON user_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_department_updated_at BEFORE UPDATE ON department
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activity_updated_at BEFORE UPDATE ON activity
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_request_updated_at BEFORE UPDATE ON request
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monthly_point_rules_updated_at BEFORE UPDATE ON monthly_point_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. CREATE INDEXES

CREATE INDEX idx_employee_role ON employee(role_id);
CREATE INDEX idx_employee_department ON employee(department_id);
CREATE INDEX idx_employee_status ON employee(status);
CREATE INDEX idx_employee_email ON employee(email);
CREATE INDEX idx_user_accounts_username ON user_accounts(username);
CREATE INDEX idx_user_accounts_employee ON user_accounts(employee_id);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);
CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_user ON password_reset_tokens(user_id);
CREATE INDEX idx_point_employee ON point(employee_id);
CREATE INDEX idx_point_transaction_employee ON point_transaction_history(employee_id);
CREATE INDEX idx_point_transaction_date ON point_transaction_history(created_at);
CREATE INDEX idx_participation_employee ON participation(employee_id);
CREATE INDEX idx_participation_activity ON participation(activity_id);
CREATE INDEX idx_attendance_employee ON attendance(employee_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_request_employee ON request(employee_id);
CREATE INDEX idx_request_status ON request(status);
CREATE INDEX idx_approval_request ON approval_history(request_id);

-- 6. INSERT SEED DATA

-- Roles
INSERT INTO role (name, description) VALUES
('admin', 'System administrator'),
('hr', 'Human resources manager'),
('manager', 'Department manager'),
('employee', 'Regular employee');

-- Departments
INSERT INTO department (name) VALUES
('Engineering'),
('Human Resources'),
('Sales'),
('Marketing'),
('Finance');

-- Employees
INSERT INTO employee (fullname, cccd, tax_code, phone, address, bank_account, join_date, birthday, gender, email, role_id, department_id, status) VALUES
('Nguyen Van Admin', '001234567890', '0123456789001', '0901234567', '123 Admin St, HCMC', '1234567890', '2020-01-15', '1985-05-20', 'male', 'admin@company.com', 1, 1, 'active'),
('Tran Thi HR', '002234567891', '0123456789002', '0901234568', '456 HR Ave, HCMC', '1234567891', '2020-03-01', '1988-08-15', 'female', 'hr@company.com', 2, 2, 'active'),
('Le Van Manager1', '003234567892', '0123456789003', '0901234569', '789 Manager Rd, HCMC', '1234567892', '2020-02-10', '1983-11-30', 'male', 'manager1@company.com', 3, 1, 'active'),
('Pham Thi Manager2', '004234567893', '0123456789004', '0901234570', '321 Manager Blvd, HCMC', '1234567893', '2020-04-20', '1986-03-25', 'female', 'manager2@company.com', 3, 3, 'active'),
('Hoang Van Manager3', '005234567894', '0123456789005', '0901234571', '654 Manager Way, HCMC', '1234567894', '2020-05-15', '1984-07-12', 'male', 'manager3@company.com', 3, 5, 'active'),
('Nguyen Van Emp1', '006234567895', '0123456789006', '0901234572', '111 Employee St, HCMC', '1234567895', '2021-01-10', '1990-01-15', 'male', 'emp1@company.com', 4, 1, 'active'),
('Tran Thi Emp2', '007234567896', '0123456789007', '0901234573', '222 Employee Ave, HCMC', '1234567896', '2021-02-20', '1992-06-20', 'female', 'emp2@company.com', 4, 1, 'active'),
('Le Van Emp3', '008234567897', '0123456789008', '0901234574', '333 Employee Rd, HCMC', '1234567897', '2021-03-15', '1991-09-10', 'male', 'emp3@company.com', 4, 3, 'active'),
('Pham Thi Emp4', '009234567898', '0123456789009', '0901234575', '444 Employee Blvd, HCMC', '1234567898', '2021-04-25', '1993-12-05', 'female', 'emp4@company.com', 4, 3, 'active'),
('Hoang Van Emp5', '010234567899', '0123456789010', '0901234576', '555 Employee Way, HCMC', '1234567899', '2021-05-30', '1989-04-18', 'male', 'emp5@company.com', 4, 5, 'active');

-- Update Department Managers
UPDATE department SET manager_id = 3 WHERE name = 'Engineering';
UPDATE department SET manager_id = 2 WHERE name = 'Human Resources';
UPDATE department SET manager_id = 4 WHERE name = 'Sales';
UPDATE department SET manager_id = 3 WHERE name = 'Marketing';
UPDATE department SET manager_id = 5 WHERE name = 'Finance';

-- User Accounts (Password: "123456")
INSERT INTO user_accounts (employee_id, username, password_hash, is_active, is_verified) VALUES
(1, 'admin', crypt('123456', gen_salt('bf')), true, true),
(2, 'hr', crypt('123456', gen_salt('bf')), true, true),
(3, 'manager1', crypt('123456', gen_salt('bf')), true, true),
(4, 'manager2', crypt('123456', gen_salt('bf')), true, true),
(5, 'manager3', crypt('123456', gen_salt('bf')), true, true),
(6, 'emp1', crypt('123456', gen_salt('bf')), true, true),
(7, 'emp2', crypt('123456', gen_salt('bf')), true, true),
(8, 'emp3', crypt('123456', gen_salt('bf')), true, true),
(9, 'emp4', crypt('123456', gen_salt('bf')), true, true),
(10, 'emp5', crypt('123456', gen_salt('bf')), true, true);

-- Points
INSERT INTO point (employee_id, point_total) VALUES
(1, 1500), (2, 1200), (3, 2000), (4, 1800), (5, 1600),
(6, 800), (7, 950), (8, 750), (9, 1100), (10, 650);

-- Point Conversion Rules
INSERT INTO point_conversion_rules (point_value, money_value, updated_by, is_active) VALUES
(100, 50000.00, 1, true),
(500, 250000.00, 1, true),
(1000, 500000.00, 1, true);

-- Point Transactions
INSERT INTO point_transaction_history (employee_id, value, type, actor_id, description) VALUES
(6, 500, 'earn', 3, 'Activity participation bonus'),
(7, 300, 'earn', 3, 'Good performance'),
(8, 400, 'earn', 4, 'Project completion'),
(6, 200, 'earn', 3, 'Attendance bonus'),
(9, 600, 'earn', 4, 'Sales achievement'),
(10, 350, 'earn', 5, 'Monthly goal reached');

-- Activities
INSERT INTO activity (name, description, start_date, end_date, registration_start_date, registration_end_date, max_participants, location, activity_type, organizer, points, status, image_url, created_by) VALUES
('Chạy bộ vì sức khỏe', 'Chương trình chạy bộ marathon nhằm nâng cao sức khỏe và tinh thần đồng đội. Tất cả nhân viên đều có thể tham gia.', '2025-01-15 06:00:00', '2025-01-15 10:00:00', '2024-12-10 00:00:00', '2025-12-25 23:59:59', 100, 'Công viên Thống Nhất', 'sports', 'Phòng Nhân sự', 50, 'upcoming', 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800', 2),
('Từ thiện vùng cao', 'Chương trình từ thiện mang đến quà tặng, sách vở cho trẻ em vùng cao. Cùng nhau chia sẻ yêu thương.', '2026-01-20 07:00:00', '2026-01-22 18:00:00', '2025-12-01 00:00:00', '2026-01-15 23:59:59', 30, 'Sơn La, Lai Châu', 'charity', 'Ban Đoàn thể', 100, 'upcoming', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800', 2),
('Workshop Kỹ năng lãnh đạo', 'Khóa đào tạo nâng cao kỹ năng lãnh đạo và quản lý nhóm cho các quản lý cấp trung.', '2025-01-18 08:00:00', '2025-01-18 17:00:00', '2024-12-10 00:00:00', '2025-12-20 23:59:59', 50, 'Phòng hội thảo A - Tầng 5', 'training', 'Phòng Đào tạo', 30, 'upcoming', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', 2),
('Team Building Mùa Đông', 'Hoạt động team building với các trò chơi ngoài trời, BBQ và gala dinner tại resort.', '2026-02-01 08:00:00', '2026-02-02 16:00:00', '2025-12-01 00:00:00', '2026-01-25 23:59:59', 150, 'Legacy Yên Tử Resort, Quảng Ninh', 'team-building', 'Ban Giám đốc', 80, 'upcoming', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800', 1),
('Hiến máu nhân đạo', 'Ngày hội hiến máu tình nguyện phối hợp cùng Viện Huyết học - Truyền máu TW.', '2025-01-25 08:00:00', '2025-01-25 16:00:00', '2024-12-10 00:00:00', '2025-12-23 23:59:59', 80, 'Hội trường Tầng 1', 'volunteer', 'Phòng Y tế', 70, 'completed', 'https://images.unsplash.com/photo-1615461065929-4f8ffed6ca40?w=800', 2),
('Giải cầu lông nội bộ', 'Giải đấu cầu lông giao hữu giữa các phòng ban nhằm tăng cường sức khỏe và gắn kết.', '2026-02-10 14:00:00', '2026-02-10 18:00:00', '2025-12-10 00:00:00', '2026-02-05 23:59:59', 32, 'Nhà thi đấu Trịnh Hoài Đức', 'sports', 'Câu lạc bộ Thể thao', 40, 'upcoming', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800', 2),
('Trồng cây xanh bảo vệ môi trường', 'Chiến dịch trồng 1000 cây xanh tại khu vực công nghiệp nhằm cải thiện môi trường làm việc.', '2026-01-28 07:00:00', '2026-01-28 11:00:00', '2025-12-10 00:00:00', '2026-01-26 23:59:59', 100, 'Khu công nghiệp Thăng Long', 'volunteer', 'Ban Môi trường', 60, 'upcoming', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800', 2),
('Yoga buổi sáng', 'Lớp yoga định kỳ mỗi sáng thứ 7 giúp thư giãn và nâng cao sức khỏe tinh thần.', '2025-12-21 06:30:00', '2025-12-21 08:00:00', '2025-12-10 00:00:00', '2025-12-20 23:59:59', 40, 'Sân thượng Tầng 10', 'sports', 'Câu lạc bộ Sức khỏe', 20, 'upcoming', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800', 2),
('Khóa học Excel nâng cao', 'Khóa đào tạo kỹ năng sử dụng Excel từ cơ bản đến nâng cao, bao gồm các hàm phức tạp và pivot table.', '2026-02-05 08:30:00', '2026-02-07 17:00:00', '2025-12-10 00:00:00', '2026-02-01 23:59:59', 60, 'Phòng máy tính B - Tầng 3', 'training', 'Phòng Đào tạo', 40, 'upcoming', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', 2),
('Bơi lội mùa hè', 'Buổi tập bơi lội tập thể dành cho nhân viên và gia đình, có huấn luyện viên hướng dẫn.', '2026-02-15 08:00:00', '2026-02-15 11:00:00', '2025-12-10 00:00:00', '2026-02-12 23:59:59', 50, 'Bể bơi Mỹ Đình', 'sports', 'Câu lạc bộ Thể thao', 45, 'upcoming', 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800', 2),
('Workshop Kỹ năng giao tiếp', 'Hội thảo nâng cao kỹ năng giao tiếp và thuyết trình hiệu quả trong môi trường công sở.', '2026-02-20 13:30:00', '2026-02-20 17:30:00', '2025-12-10 00:00:00', '2026-02-18 23:59:59', 45, 'Hội trường Tầng 2', 'training', 'Phòng Nhân sự', 35, 'upcoming', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', 2),
('Dã ngoại cuối tuần', 'Chuyến du lịch ngắn ngày đến Tam Đảo, tham quan và nghỉ dưỡng cùng đồng nghiệp.', '2026-02-22 06:00:00', '2026-02-23 18:00:00', '2025-12-10 00:00:00', '2026-02-19 23:59:59', 80, 'Tam Đảo, Vĩnh Phúc', 'team-building', 'Ban Đoàn thể', 65, 'upcoming', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800', 2),
('Tặng quà trung thu cho trẻ em', 'Chương trình trao tặng bánh trung thu và quà cho trẻ em có hoàn cảnh khó khăn.', '2025-09-10 08:00:00', '2025-09-10 16:00:00', '2024-12-16 00:00:00', '2025-09-05 23:59:59', 35, 'Trung tâm Bảo trợ trẻ em Hà Nội', 'charity', 'Ban Đoàn thể', 85, 'completed', 'https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?w=800', 2);

-- 10. Participation
INSERT INTO participation (employee_id, activity_id, status, result) VALUES
(6, 3, 'attended', 'Completed successfully'),
(7, 3, 'attended', 'Completed successfully'),
(8, 3, 'attended', 'Completed successfully'),
(6, 1, 'registered', NULL),
(7, 1, 'registered', NULL);

-- 11. Attendance
INSERT INTO attendance (employee_id, date, checkin_time, checkout_time, status, work_hours, overtime_hours) VALUES
(6, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '08:30:00', (CURRENT_DATE - 6) + TIME '17:45:00', 'present', 8.25, 0.75),
(6, CURRENT_DATE - 5, (CURRENT_DATE - 5) + TIME '08:15:00', (CURRENT_DATE - 5) + TIME '17:30:00', 'present', 8.25, 0),
(7, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '08:20:00', (CURRENT_DATE - 6) + TIME '17:30:00', 'present', 8.17, 0),
(7, CURRENT_DATE - 5, (CURRENT_DATE - 5) + TIME '08:30:00', (CURRENT_DATE - 5) + TIME '17:30:00', 'present', 8, 0);

-- 12. Requests
INSERT INTO request (employee_id, description, start_time, end_time, type, status) VALUES
(6, 'WFH due to family matter', CURRENT_DATE + 1 + TIME '08:30:00', CURRENT_DATE + 1 + TIME '17:30:00', 'wfh', 'pending'),
(7, 'Annual leave', CURRENT_DATE + 5 + TIME '00:00:00', CURRENT_DATE + 7 + TIME '23:59:59', 'leave', 'pending'),
(8, 'Late check-in correction', CURRENT_DATE - 1 + TIME '08:30:00', CURRENT_DATE - 1 + TIME '17:30:00', 'attendance_correction', 'approved');

-- 13. Monthly Point Rules
INSERT INTO monthly_point_rules (role_id, point_value, is_active) VALUES
(1, 200, true),  -- Admin: 200 điểm/tháng
(2, 150, true),  -- HR: 150 điểm/tháng
(3, 150, true),  -- Manager: 150 điểm/tháng
(4, 100, true);  -- Employee: 100 điểm/tháng

ALTER TABLE point_to_money_history
ALTER COLUMN created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC';

ALTER TABLE point_to_money_history
ALTER COLUMN processed_at TYPE timestamptz USING processed_at AT TIME ZONE 'UTC';
