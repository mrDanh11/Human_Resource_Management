-- ============================================
-- MONTHLY POINT ALLOCATION RULES
-- ============================================

-- Bảng quy tắc cộng điểm tự động hàng tháng
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

-- Bảng lịch sử chạy job cộng điểm tự động
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

-- Trigger
CREATE TRIGGER update_monthly_point_rules_updated_at BEFORE UPDATE ON monthly_point_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data: Quy tắc cộng điểm theo role
INSERT INTO monthly_point_rules (role_id, point_value, is_active) VALUES
(1, 200, true),  -- Admin: 200 điểm/tháng
(2, 150, true),  -- HR: 150 điểm/tháng
(3, 150, true),  -- Manager: 150 điểm/tháng
(4, 100, true);  -- Employee: 100 điểm/tháng