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

-- Update department managers
UPDATE department SET manager_id = 3 WHERE name = 'Engineering';
UPDATE department SET manager_id = 2 WHERE name = 'Human Resources';
UPDATE department SET manager_id = 4 WHERE name = 'Sales';
UPDATE department SET manager_id = 3 WHERE name = 'Marketing';
UPDATE department SET manager_id = 5 WHERE name = 'Finance';

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
(7, 1, 'registered', NULL);

-- Attendance
INSERT INTO attendance (employee_id, date, checkin_time, checkout_time, status, work_hours, overtime_hours) VALUES
(6, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '08:30:00', (CURRENT_DATE - 6) + TIME '17:45:00', 'present', 8.25, 0.75),
(6, CURRENT_DATE - 5, (CURRENT_DATE - 5) + TIME '08:15:00', (CURRENT_DATE - 5) + TIME '17:30:00', 'present', 8.25, 0),
(7, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '08:20:00', (CURRENT_DATE - 6) + TIME '17:30:00', 'present', 8.17, 0),
(7, CURRENT_DATE - 5, (CURRENT_DATE - 5) + TIME '08:30:00', (CURRENT_DATE - 5) + TIME '17:30:00', 'present', 8, 0);

-- Requests
INSERT INTO request (employee_id, description, start_time, end_time, type, status) VALUES
(6, 'WFH due to family matter', CURRENT_DATE + 1 + TIME '08:30:00', CURRENT_DATE + 1 + TIME '17:30:00', 'wfh', 'pending'),
(7, 'Annual leave', CURRENT_DATE + 5 + TIME '00:00:00', CURRENT_DATE + 7 + TIME '23:59:59', 'leave', 'pending'),
(8, 'Late check-in correction', CURRENT_DATE - 1 + TIME '08:30:00', CURRENT_DATE - 1 + TIME '17:30:00', 'attendance_correction', 'approved');

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