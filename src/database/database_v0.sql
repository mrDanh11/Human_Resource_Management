-- ============================================
-- HR MANAGEMENT SYSTEM - OPTIMIZED DATABASE
-- ============================================

-- Drop existing tables
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

-- ============================================
-- ROLE TABLE
-- ============================================
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- DEPARTMENT TABLE
-- ============================================
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    manager_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- EMPLOYEE TABLE
-- ============================================
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

-- ============================================
-- USER ACCOUNTS TABLE (Login với Email/Username)
-- ============================================
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

-- ============================================
-- REFRESH TOKENS TABLE
-- ============================================
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

-- ============================================
-- PASSWORD RESET TOKENS TABLE
-- ============================================
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

-- ============================================
-- POINT TABLE
-- ============================================
CREATE TABLE point (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL UNIQUE,
    point_total INTEGER DEFAULT 0 CHECK (point_total >= 0),
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- ============================================
-- POINT TRANSACTION HISTORY
-- ============================================
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

-- ============================================
-- POINT CONVERSION RULES
-- ============================================
CREATE TABLE point_conversion_rules (
    id SERIAL PRIMARY KEY,
    point_value INTEGER NOT NULL,
    money_value DECIMAL(15,2) NOT NULL,
    updated_by INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (updated_by) REFERENCES employee(id)
);

-- ============================================
-- POINT TO MONEY HISTORY
-- ============================================
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

-- ============================================
-- ACTIVITY TABLE
-- ============================================
CREATE TABLE activity (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    register_deadline TIMESTAMP NOT NULL,
    max_participants INTEGER,
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES employee(id)
);

-- ============================================
-- PARTICIPATION TABLE
-- ============================================
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

-- ============================================
-- ATTENDANCE TABLE
-- ============================================
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

-- ============================================
-- REQUEST TABLE
-- ============================================
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

-- ============================================
-- APPROVAL HISTORY TABLE
-- ============================================
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

-- ============================================
-- INDEXES
-- ============================================
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

-- ============================================
-- TRIGGERS
-- ============================================
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

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Roles
INSERT INTO role (name, description) VALUES
('admin', 'System administrator'),
('hr', 'Human resources manager'),
('manager', 'Department manager'),
('employee', 'Regular employee');

-- Departments  
INSERT INTO department (name) VALUES
('Công nghệ thông tin'),
('Nhân sự'), 
('Ban giám đốc'),
('Sales'),
('Marketing');

-- Employees (tương ứng với demo users trong frontend)
INSERT INTO employee (fullname, cccd, tax_code, phone, address, bank_account, join_date, birthday, gender, email, role_id, department_id, status) VALUES
('Nguyễn Quản Trị', '079111111111', '0111111111001', '0901111111', '123 Admin Street, Quận 1, TP.HCM', '1111111111|Vietcombank|NGUYEN QUAN TRI', '2020-01-01', '1985-05-20', 'male', 'admin@company.com', 1, 3, 'active'),
('Trần Nhân Sự', '079222222222', '0222222222002', '0902222222', '456 HR Avenue, Quận 3, TP.HCM', '2222222222|Techcombank|TRAN NHAN SU', '2021-03-15', '1988-08-15', 'female', 'hr@company.com', 2, 2, 'active'),
('Lê Quản Lý', '079333333333', '0333333333003', '0903333333', '789 Manager Road, Quận 5, TP.HCM', '3333333333|ACB|LE QUAN LY', '2022-06-01', '1983-11-30', 'male', 'manager@company.com', 3, 1, 'active'),
('Nguyễn Nhân Viên', '079444444444', '0444444444004', '0904444444', '321 Employee Street, Quận 7, TP.HCM', '4444444444|VietinBank|NGUYEN NHAN VIEN', '2023-01-15', '1990-01-15', 'male', 'employee@company.com', 4, 1, 'active'),
-- Thêm tất cả các tài khoản demo từ frontend
('Phạm Thu Hương', '079555555555', '0555555555005', '0905555555', '567 Sales Street, Quận 4, TP.HCM', '5555555555|BIDV|PHAM THU HUONG', '2022-08-10', '1987-12-05', 'female', 'sales@company.com', 3, 4, 'active'),
('Vũ Minh Hải', '079666666666', '0666666666006', '0906666666', '890 Accounting Ave, Quận 6, TP.HCM', '6666666666|MB Bank|VU MINH HAI', '2023-03-20', '1989-04-18', 'male', 'accounting@company.com', 4, 2, 'active'),
('Lê Thị Mai', '079777777777', '0777777777007', '0907777777', '234 Marketing Blvd, Quận 8, TP.HCM', '7777777777|TPBank|LE THI MAI', '2023-05-15', '1991-09-22', 'female', 'marketing@company.com', 4, 5, 'active'),
('Hoàng Văn Nam', '079888888888', '0888888888008', '0908888888', '345 Leader Lane, Quận 9, TP.HCM', '8888888888|SCB|HOANG VAN NAM', '2022-11-01', '1986-06-14', 'male', 'team.leader@company.com', 3, 1, 'active'),
('Đỗ Thị Lan', '079999999999', '0999999999009', '0909999999', '456 Intern Street, Quận 10, TP.HCM', '9999999999|LPBank|DO THI LAN', '2024-06-01', '2001-03-08', 'female', 'intern@company.com', 4, 1, 'active'),
('Nguyễn Thành Đạt', '079000000000', '0000000000010', '0900000000', '678 Service Road, Quận 11, TP.HCM', '0000000000|VPBank|NGUYEN THANH DAT', '2023-07-12', '1993-10-27', 'male', 'cs@company.com', 4, 2, 'active'),
-- Thêm một vài nhân viên khác
('Nguyễn Chí Danh', '079123456789', '0123456789001', '0901234567', '123 Nguyễn Văn Cừ, Quận 5, TP.HCM', '1234567890|Vietcombank|NGUYEN CHI DANH', '2023-01-15', '1995-03-10', 'male', 'danh.nguyen@company.com', 4, 1, 'active'),
('Trần Thị Mai', '079987654321', '0987654321009', '0909876543', '456 Lê Văn Sỹ, Quận 3, TP.HCM', '9876543210|Sacombank|TRAN THI MAI', '2023-02-20', '1992-07-25', 'female', 'mai.tran@company.com', 4, 2, 'active');

-- Update department managers
UPDATE department SET manager_id = 3 WHERE name = 'Công nghệ thông tin';
UPDATE department SET manager_id = 2 WHERE name = 'Nhân sự';
UPDATE department SET manager_id = 1 WHERE name = 'Ban giám đốc';
UPDATE department SET manager_id = 3 WHERE name = 'Sales';
UPDATE department SET manager_id = 3 WHERE name = 'Marketing';

-- User Accounts (Password: "Password123!")
-- INSERT INTO user_accounts (employee_id, username, password_hash, is_active, is_verified) VALUES
-- (1, 'admin', '$2a$10$rQ3qK5YlZJxz8qH6xvxvPuKJxh3vQ1XvPqxQxQ1xQ1xQ1xQ1xQ1xQ', true, true),
-- (2, 'hr_manager', '$2a$10$rQ3qK5YlZJxz8qH6xvxvPuKJxh3vQ1XvPqxQxQ1xQ1xQ1xQ1xQ1xQ', true, true),
-- (3, 'manager1', '$2a$10$rQ3qK5YlZJxz8qH6xvxvPuKJxh3vQ1XvPqxQxQ1xQ1xQ1xQ1xQ1xQ', true, true),
-- (4, 'manager2', '$2a$10$rQ3qK5YlZJxz8qH6xvxvPuKJxh3vQ1XvPqxQxQ1xQ1xQ1xQ1xQ1xQ', true, true),
-- (5, 'manager3', '$2a$10$rQ3qK5YlZJxz8qH6xvxvPuKJxh3vQ1XvPqxQxQ1xQ1xQ1xQ1xQ1xQ', true, true),
-- (6, 'emp1', '$2a$10$rQ3qK5YlZJxz8qH6xvxvPuKJxh3vQ1XvPqxQxQ1xQ1xQ1xQ1xQ1xQ', true, true),
-- (7, 'emp2', '$2a$10$rQ3qK5YlZJxz8qH6xvxvPuKJxh3vQ1XvPqxQxQ1xQ1xQ1xQ1xQ1xQ', true, true),
-- (8, 'emp3', '$2a$10$rQ3qK5YlZJxz8qH6xvxvPuKJxh3vQ1XvPqxQxQ1xQ1xQ1xQ1xQ1xQ', true, true),
-- (9, 'emp4', '$2a$10$rQ3qK5YlZJxz8qH6xvxvPuKJxh3vQ1XvPqxQxQ1xQ1xQ1xQ1xQ1xQ', true, true),
-- (10, 'emp5', '$2a$10$rQ3qK5YlZJxz8qH6xvxvPuKJxh3vQ1XvPqxQxQ1xQ1xQ1xQ1xQ1xQ', true, true);

-- Points
INSERT INTO point (employee_id, point_total) VALUES
(1, 1500), (2, 1200), (3, 2000), (4, 1800), (5, 1600),
(6, 800), (7, 950), (8, 750), (9, 1100), (10, 650),
(11, 1250), (12, 890);

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
(10, 350, 'earn', 5, 'Monthly goal reached'),
-- Thêm transactions cho nhân viên mới
(5, 800, 'earn', 3, 'Sales target achievement'),
(5, 400, 'earn', 1, 'Leadership bonus'),
(7, 250, 'earn', 2, 'Marketing campaign success'),
(8, 350, 'earn', 3, 'Code review excellence'),
(9, 200, 'earn', 3, 'Mentoring junior staff'),
(10, 300, 'earn', 2, 'Customer satisfaction bonus'),
(11, 500, 'earn', 1, 'First month performance'),
(12, 400, 'earn', 2, 'Process improvement');

-- Activities
INSERT INTO activity (name, description, start_date, end_date, register_deadline, max_participants, status, created_by) VALUES
('Team Building Q4 2024', 'Quarterly team building', '2024-12-15 09:00:00', '2024-12-15 18:00:00', '2024-12-10 23:59:59', 50, 'upcoming', 2),
('Annual Health Check', 'Company health screening', '2024-12-20 08:00:00', '2024-12-20 17:00:00', '2024-12-15 23:59:59', 100, 'upcoming', 2),
('Technical Workshop', 'Technology training', '2024-11-10 13:00:00', '2024-11-10 17:00:00', '2024-11-08 23:59:59', 30, 'completed', 3);

-- Participation
INSERT INTO participation (employee_id, activity_id, status, result) VALUES
(6, 3, 'attended', 'Completed successfully'),
(7, 3, 'attended', 'Completed successfully'),
(8, 3, 'attended', 'Completed successfully'),
(6, 1, 'registered', NULL),
(7, 1, 'registered', NULL),
-- Thêm participation cho nhân viên mới
(5, 1, 'registered', NULL),
(8, 1, 'registered', NULL),
(9, 3, 'attended', 'Excellent participation'),
(10, 2, 'registered', NULL),
(11, 2, 'registered', NULL);

-- Attendance  
INSERT INTO attendance (employee_id, date, checkin_time, checkout_time, status, work_hours, overtime_hours) VALUES
(6, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '08:30:00', (CURRENT_DATE - 6) + TIME '17:45:00', 'present', 8.25, 0.75),
(6, CURRENT_DATE - 5, (CURRENT_DATE - 5) + TIME '08:15:00', (CURRENT_DATE - 5) + TIME '17:30:00', 'present', 8.25, 0),
(7, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '08:20:00', (CURRENT_DATE - 6) + TIME '17:30:00', 'present', 8.17, 0),
(7, CURRENT_DATE - 5, (CURRENT_DATE - 5) + TIME '08:30:00', (CURRENT_DATE - 5) + TIME '17:30:00', 'present', 8, 0),
-- Thêm attendance cho nhân viên mới
(5, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '08:00:00', (CURRENT_DATE - 6) + TIME '18:00:00', 'present', 9, 1),
(5, CURRENT_DATE - 5, (CURRENT_DATE - 5) + TIME '08:15:00', (CURRENT_DATE - 5) + TIME '17:30:00', 'present', 8.25, 0),
(8, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '08:45:00', (CURRENT_DATE - 6) + TIME '17:30:00', 'late', 7.75, 0),
(9, CURRENT_DATE - 5, (CURRENT_DATE - 5) + TIME '08:30:00', (CURRENT_DATE - 5) + TIME '17:30:00', 'present', 8, 0),
(10, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '08:20:00', (CURRENT_DATE - 6) + TIME '17:40:00', 'present', 8.33, 0);

-- Requests
INSERT INTO request (employee_id, description, start_time, end_time, type, status) VALUES
(6, 'WFH due to family matter', CURRENT_DATE + 1 + TIME '08:30:00', CURRENT_DATE + 1 + TIME '17:30:00', 'wfh', 'pending'),
(7, 'Annual leave', CURRENT_DATE + 5 + TIME '00:00:00', CURRENT_DATE + 7 + TIME '23:59:59', 'leave', 'pending'),
(8, 'Late check-in correction', CURRENT_DATE - 1 + TIME '08:30:00', CURRENT_DATE - 1 + TIME '17:30:00', 'attendance_correction', 'approved'),
-- Thêm requests cho nhân viên mới
(5, 'Business trip to Hanoi', CURRENT_DATE + 10 + TIME '08:00:00', CURRENT_DATE + 12 + TIME '18:00:00', 'other', 'approved'),
(9, 'Equipment request: New laptop', CURRENT_DATE + 2 + TIME '08:00:00', CURRENT_DATE + 2 + TIME '17:00:00', 'equipment', 'pending'),
(10, 'WFH for training course', CURRENT_DATE + 3 + TIME '08:30:00', CURRENT_DATE + 3 + TIME '17:30:00', 'wfh', 'approved');

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- -- Login với Email hoặc Username
-- CREATE OR REPLACE FUNCTION verify_user_credentials(
--     p_identifier VARCHAR(100),
--     p_password_hash VARCHAR(255)
-- ) RETURNS TABLE(
--     user_id INTEGER,
--     employee_id INTEGER,
--     username VARCHAR(50),
--     email VARCHAR(100),
--     fullname VARCHAR(100),
--     role_name VARCHAR(50),
--     is_active BOOLEAN
-- ) AS $$
-- BEGIN
--     RETURN QUERY
--     SELECT 
--         ua.id,
--         ua.employee_id,
--         ua.username,
--         e.email,
--         e.fullname,
--         r.name as role_name,
--         ua.is_active
--     FROM user_accounts ua
--     JOIN employee e ON ua.employee_id = e.id
--     JOIN role r ON e.role_id = r.id
--     WHERE (ua.username = p_identifier OR e.email = p_identifier)
--     AND ua.password_hash = p_password_hash
--     AND ua.is_active = true
--     AND (ua.locked_until IS NULL OR ua.locked_until < CURRENT_TIMESTAMP);
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Record Login Attempt
-- CREATE OR REPLACE FUNCTION record_login_attempt(
--     p_identifier VARCHAR(100),
--     p_success BOOLEAN,
--     p_ip_address INET DEFAULT NULL
-- ) RETURNS VOID AS $$
-- DECLARE
--     v_user_id INTEGER;
--     v_failed_attempts INTEGER;
-- BEGIN
--     SELECT ua.id, ua.failed_login_attempts INTO v_user_id, v_failed_attempts
--     FROM user_accounts ua
--     LEFT JOIN employee e ON ua.employee_id = e.id
--     WHERE ua.username = p_identifier OR e.email = p_identifier;
    
--     IF v_user_id IS NOT NULL THEN
--         IF p_success THEN
--             UPDATE user_accounts
--             SET failed_login_attempts = 0,
--                 last_login = CURRENT_TIMESTAMP,
--                 locked_until = NULL
--             WHERE id = v_user_id;
--         ELSE
--             v_failed_attempts := v_failed_attempts + 1;
--             UPDATE user_accounts
--             SET failed_login_attempts = v_failed_attempts,
--                 locked_until = CASE 
--                     WHEN v_failed_attempts >= 5 THEN CURRENT_TIMESTAMP + INTERVAL '30 minutes'
--                     ELSE NULL
--                 END
--             WHERE id = v_user_id;
--         END IF;
--     END IF;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Create Refresh Token
-- CREATE OR REPLACE FUNCTION create_refresh_token(
--     p_user_id INTEGER,
--     p_token VARCHAR(500),
--     p_device_info TEXT DEFAULT NULL,
--     p_ip_address INET DEFAULT NULL
-- ) RETURNS INTEGER AS $$
-- DECLARE
--     v_token_id INTEGER;
-- BEGIN
--     INSERT INTO refresh_tokens (user_id, token, expires_at, device_info, ip_address)
--     VALUES (p_user_id, p_token, CURRENT_TIMESTAMP + INTERVAL '30 days', p_device_info, p_ip_address)
--     RETURNING id INTO v_token_id;
    
--     RETURN v_token_id;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Validate Refresh Token
-- CREATE OR REPLACE FUNCTION validate_refresh_token(
--     p_token VARCHAR(500)
-- ) RETURNS TABLE(
--     token_id INTEGER,
--     user_id INTEGER,
--     is_valid BOOLEAN
-- ) AS $$
-- BEGIN
--     RETURN QUERY
--     SELECT 
--         rt.id,
--         rt.user_id,
--         CASE 
--             WHEN rt.is_revoked = false AND rt.expires_at > CURRENT_TIMESTAMP 
--             THEN true 
--             ELSE false 
--         END as is_valid
--     FROM refresh_tokens rt
--     WHERE rt.token = p_token;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Revoke Refresh Token
-- CREATE OR REPLACE FUNCTION revoke_refresh_token(
--     p_token VARCHAR(500)
-- ) RETURNS BOOLEAN AS $$
-- BEGIN
--     UPDATE refresh_tokens
--     SET is_revoked = true, revoked_at = CURRENT_TIMESTAMP
--     WHERE token = p_token;
--     RETURN FOUND;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Create Password Reset Token
-- CREATE OR REPLACE FUNCTION create_password_reset_token(
--     p_email VARCHAR(100),
--     p_token VARCHAR(255)
-- ) RETURNS INTEGER AS $$
-- DECLARE
--     v_user_id INTEGER;
--     v_token_id INTEGER;
-- BEGIN
--     SELECT ua.id INTO v_user_id
--     FROM user_accounts ua
--     JOIN employee e ON ua.employee_id = e.id
--     WHERE e.email = p_email AND ua.is_active = true;
    
--     IF v_user_id IS NULL THEN
--         RETURN NULL;
--     END IF;
    
--     UPDATE password_reset_tokens
--     SET used = true
--     WHERE user_id = v_user_id AND used = false;
    
--     INSERT INTO password_reset_tokens (user_id, token, expires_at)
--     VALUES (v_user_id, p_token, CURRENT_TIMESTAMP + INTERVAL '1 hour')
--     RETURNING id INTO v_token_id;
    
--     RETURN v_token_id;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Reset Password
-- CREATE OR REPLACE FUNCTION reset_password_with_token(
--     p_token VARCHAR(255),
--     p_new_password_hash VARCHAR(255)
-- ) RETURNS BOOLEAN AS $$
-- DECLARE
--     v_user_id INTEGER;
-- BEGIN
--     SELECT user_id INTO v_user_id
--     FROM password_reset_tokens
--     WHERE token = p_token
--     AND used = false
--     AND expires_at > CURRENT_TIMESTAMP;
    
--     IF v_user_id IS NULL THEN
--         RETURN false;
--     END IF;
    
--     UPDATE user_accounts
--     SET password_hash = p_new_password_hash,
--         failed_login_attempts = 0,
--         locked_until = NULL
--     WHERE id = v_user_id;
    
--     UPDATE password_reset_tokens
--     SET used = true, used_at = CURRENT_TIMESTAMP
--     WHERE token = p_token;
    
--     UPDATE refresh_tokens
--     SET is_revoked = true, revoked_at = CURRENT_TIMESTAMP
--     WHERE user_id = v_user_id;
    
--     RETURN true;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Add Points
-- CREATE OR REPLACE FUNCTION add_points_to_employee(
--     p_employee_id INTEGER,
--     p_points INTEGER,
--     p_actor_id INTEGER,
--     p_description TEXT
-- ) RETURNS BOOLEAN AS $$
-- BEGIN
--     UPDATE point 
--     SET point_total = point_total + p_points,
--         last_update = CURRENT_TIMESTAMP
--     WHERE employee_id = p_employee_id;
    
--     INSERT INTO point_transaction_history (employee_id, value, type, actor_id, description)
--     VALUES (p_employee_id, p_points, 'earn', p_actor_id, p_description);
    
--     RETURN TRUE;
-- EXCEPTION
--     WHEN OTHERS THEN
--         RETURN FALSE;
-- END;
-- $$ LANGUAGE plpgsql;

-- COMMIT;