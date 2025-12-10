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
INSERT INTO user_accounts (employee_id, username, password_hash, is_active, is_verified) VALUES
(1, 'admin', '$2a$10$rQ3qK5YlZJxz8qH6xvxvPuKJxh3vQ1XvPqxQxQ1xQ1xQ1xQ1xQ1xQ', true, true),
(2, 'hr_manager', '$2a$10$rQ3qK5YlZJxz8qH6xvxvPuKJxh3vQ1XvPqxQxQ1xQ1xQ1xQ1xQ1xQ', true, true),
(3, 'manager1', '$2a$10$rQ3qK5YlZJxz8qH6xvxvPuKJxh3vQ1XvPqxQxQ1xQ1xQ1xQ1xQ1xQ', true, true),
(4, 'manager2', '$2a$10$rQ3qK5YlZJxz8qH6xvxvPuKJxh3vQ1XvPqxQxQ1xQ1xQ1xQ1xQ1xQ', true, true),
(5, 'manager3', '$2a$10$rQ3qK5YlZJxz8qH6xvxvPuKJxh3vQ1XvPqxQxQ1xQ1xQ1xQ1xQ1xQ', true, true),
(6, 'emp1', '$2a$10$rQ3qK5YlZJxz8qH6xvxvPuKJxh3vQ1XvPqxQxQ1xQ1xQ1xQ1xQ1xQ', true, true),
(7, 'emp2', '$2a$10$rQ3qK5YlZJxz8qH6xvxvPuKJxh3vQ1XvPqxQxQ1xQ1xQ1xQ1xQ1xQ', true, true),
(8, 'emp3', '$2a$10$rQ3qK5YlZJxz8qH6xvxvPuKJxh3vQ1XvPqxQxQ1xQ1xQ1xQ1xQ1xQ', true, true),
(9, 'emp4', '$2a$10$rQ3qK5YlZJxz8qH6xvxvPuKJxh3vQ1XvPqxQxQ1xQ1xQ1xQ1xQ1xQ', true, true),
(10, 'emp5', '$2a$10$rQ3qK5YlZJxz8qH6xvxvPuKJxh3vQ1XvPqxQxQ1xQ1xQ1xQ1xQ1xQ', true, true);

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
