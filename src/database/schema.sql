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
    manager_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (department_id) REFERENCES department(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
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
    is_deleted BOOLEAN DEFAULT FALSE,
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
    performance VARCHAR(20) CHECK (performance IN ('bad', 'good', 'excellent')),
    result JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(id),
    FOREIGN KEY (activity_id) REFERENCES activity(id),
    UNIQUE(employee_id, activity_id),
    CHECK (
        result IS NULL OR 
        jsonb_typeof(result) = 'object'
    )
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
CREATE INDEX idx_employee_manager ON employee(manager_id);
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
CREATE INDEX idx_participation_result_gin ON participation USING GIN (result);
CREATE INDEX idx_attendance_employee ON attendance(employee_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_request_employee ON request(employee_id);
CREATE INDEX idx_request_status ON request(status);
CREATE INDEX idx_approval_request ON approval_history(request_id);

