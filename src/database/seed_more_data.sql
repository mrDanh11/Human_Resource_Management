-- ============================================
-- ADDITIONAL SEED DATA
-- ============================================

-- 1. MORE EMPLOYEES (11-20)
INSERT INTO employee (fullname, cccd, tax_code, phone, address, bank_account, join_date, birthday, gender, email, role_id, department_id, status, manager_id) VALUES
('Nguyen Van Dev1', '011234567890', '0123456789011', '0901234581', '111 Dev Lane, HCMC', '1234567811', '2022-01-15', '1995-05-20', 'male', 'dev1@company.com', 4, 1, 'active', 3), -- Engineering, Mgr: Manager1
('Tran Thi Dev2', '012234567891', '0123456789012', '0901234582', '222 Dev Lane, HCMC', '1234567812', '2022-02-20', '1996-08-15', 'female', 'dev2@company.com', 4, 1, 'active', 3), -- Engineering, Mgr: Manager1
('Le Van Sales1', '013234567892', '0123456789013', '0901234583', '333 Sales St, HCMC', '1234567813', '2022-03-10', '1994-11-30', 'male', 'sales1@company.com', 4, 3, 'active', 4), -- Sales, Mgr: Manager2
('Pham Thi Sales2', '014234567893', '0123456789014', '0901234584', '444 Sales St, HCMC', '1234567814', '2022-04-25', '1997-03-25', 'female', 'sales2@company.com', 4, 3, 'active', 4), -- Sales, Mgr: Manager2
('Hoang Van Mkt1', '015234567894', '0123456789015', '0901234585', '555 Mkt Rd, HCMC', '1234567815', '2022-05-15', '1993-07-12', 'male', 'mkt1@company.com', 4, 4, 'active', 3), -- Marketing, Mgr: Manager1 (based on dept manager)
('Nguyen Thi Mkt2', '016234567895', '0123456789016', '0901234586', '666 Mkt Rd, HCMC', '1234567816', '2022-06-10', '1998-01-15', 'female', 'mkt2@company.com', 4, 4, 'active', 3), -- Marketing, Mgr: Manager1
('Tran Van Fin1', '017234567896', '0123456789017', '0901234587', '777 Fin Blvd, HCMC', '1234567817', '2022-07-20', '1992-06-20', 'male', 'fin1@company.com', 4, 5, 'active', 5), -- Finance, Mgr: Manager3
('Le Thi Fin2', '018234567897', '0123456789018', '0901234588', '888 Fin Blvd, HCMC', '1234567818', '2022-08-15', '1995-09-10', 'female', 'fin2@company.com', 4, 5, 'active', 5), -- Finance, Mgr: Manager3
('Pham Van HR1', '019234567898', '0123456789019', '0901234589', '999 HR Way, HCMC', '1234567819', '2022-09-25', '1991-12-05', 'male', 'hr1@company.com', 4, 2, 'active', 2), -- HR, Mgr: HR Manager (ID 2)
('Hoang Thi HR2', '020234567899', '0123456789020', '0901234590', '000 HR Way, HCMC', '1234567820', '2022-10-30', '1996-04-18', 'female', 'hr2@company.com', 4, 2, 'active', 2); -- HR, Mgr: HR Manager (ID 2)

-- 2. USER ACCOUNTS (11-20)
INSERT INTO user_accounts (employee_id, username, password_hash, is_active, is_verified) VALUES
(11, 'dev1', crypt('123456', gen_salt('bf')), true, true),
(12, 'dev2', crypt('123456', gen_salt('bf')), true, true),
(13, 'sales1', crypt('123456', gen_salt('bf')), true, true),
(14, 'sales2', crypt('123456', gen_salt('bf')), true, true),
(15, 'mkt1', crypt('123456', gen_salt('bf')), true, true),
(16, 'mkt2', crypt('123456', gen_salt('bf')), true, true),
(17, 'fin1', crypt('123456', gen_salt('bf')), true, true),
(18, 'fin2', crypt('123456', gen_salt('bf')), true, true),
(19, 'hr1', crypt('123456', gen_salt('bf')), true, true),
(20, 'hr2', crypt('123456', gen_salt('bf')), true, true);

-- 3. POINTS (11-20)
INSERT INTO point (employee_id, point_total) VALUES
(11, 500), (12, 600), (13, 450), (14, 700), (15, 300),
(16, 800), (17, 550), (18, 900), (19, 400), (20, 650);

-- 4. MORE ACTIVITIES
INSERT INTO activity (name, description, start_date, end_date, registration_start_date, registration_end_date, max_participants, location, activity_type, organizer, points, status, image_url, created_by) VALUES
('Hackathon 2025', 'Cuộc thi lập trình nội bộ dành cho khối kỹ thuật.', '2025-06-15 08:00:00', '2025-06-16 18:00:00', '2025-05-01 00:00:00', '2025-06-10 23:59:59', 50, 'Phòng họp lớn', 'training', 'Phòng Kỹ thuật', 150, 'upcoming', 'https://images.unsplash.com/photo-1504384308090-c54be9852d85?w=800', 3),
('Giải bóng đá nam', 'Giải bóng đá thường niên.', '2025-07-01 17:00:00', '2025-07-30 19:00:00', '2025-06-01 00:00:00', '2025-06-25 23:59:59', 100, 'Sân vận động Mỹ Đình', 'sports', 'Công đoàn', 100, 'upcoming', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800', 2),
('Quyên góp sách', 'Quyên góp sách cho thư viện vùng cao.', '2025-08-15 08:00:00', '2025-08-20 17:00:00', '2025-08-01 00:00:00', '2025-08-14 23:59:59', 200, 'Sảnh chính', 'charity', 'Ban Từ thiện', 50, 'upcoming', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800', 2);

-- 5. PARTICIPATION
-- Devs join Hackathon
INSERT INTO participation (employee_id, activity_id, status) VALUES
(11, 14, 'registered'),
(12, 14, 'registered'),
(6, 14, 'registered'),
(7, 14, 'registered');

-- Everyone joins Charity
INSERT INTO participation (employee_id, activity_id, status) VALUES
(11, 16, 'registered'), (12, 16, 'registered'), (13, 16, 'registered'), (14, 16, 'registered'),
(15, 16, 'registered'), (16, 16, 'registered'), (17, 16, 'registered'), (18, 16, 'registered');

-- 6. REQUESTS & APPROVALS
-- Dev1 requests WFH (Approved by Manager1)
INSERT INTO request (employee_id, description, start_time, end_time, type, status) VALUES
(11, 'Work from home due to sickness', CURRENT_DATE + 2 + TIME '08:30:00', CURRENT_DATE + 2 + TIME '17:30:00', 'wfh', 'approved');

INSERT INTO approval_history (request_id, approver_id, status, note) 
SELECT id, 3, 'approved', 'Take care' FROM request WHERE employee_id = 11 AND type = 'wfh' ORDER BY id DESC LIMIT 1;

-- Sales1 requests Leave (Pending)
INSERT INTO request (employee_id, description, start_time, end_time, type, status) VALUES
(13, 'Family vacation', CURRENT_DATE + 10 + TIME '00:00:00', CURRENT_DATE + 12 + TIME '23:59:59', 'leave', 'pending');

-- Fin1 requests OT (Rejected by Manager3)
INSERT INTO request (employee_id, description, start_time, end_time, type, status) VALUES
(17, 'Closing financial reports', CURRENT_DATE - 1 + TIME '17:30:00', CURRENT_DATE - 1 + TIME '20:30:00', 'overtime', 'rejected');

INSERT INTO approval_history (request_id, approver_id, status, note)
SELECT id, 5, 'rejected', 'Not necessary at this time' FROM request WHERE employee_id = 17 AND type = 'overtime' ORDER BY id DESC LIMIT 1;

-- 7. ATTENDANCE (Last 3 days for new employees)
INSERT INTO attendance (employee_id, date, checkin_time, checkout_time, status, work_hours) VALUES
(11, CURRENT_DATE - 1, (CURRENT_DATE - 1) + TIME '08:25:00', (CURRENT_DATE - 1) + TIME '17:35:00', 'present', 8.1),
(11, CURRENT_DATE - 2, (CURRENT_DATE - 2) + TIME '08:30:00', (CURRENT_DATE - 2) + TIME '17:30:00', 'present', 8.0),
(13, CURRENT_DATE - 1, (CURRENT_DATE - 1) + TIME '08:45:00', (CURRENT_DATE - 1) + TIME '17:45:00', 'late', 8.0);

-- 8. POINT TRANSACTIONS
INSERT INTO point_transaction_history (employee_id, value, type, actor_id, description) VALUES
(11, 100, 'earn', 3, 'Welcome bonus'),
(12, 100, 'earn', 3, 'Welcome bonus'),
(13, 50, 'earn', 4, 'Sales target met');

-- 9. POINT REDEMPTION
INSERT INTO point_to_money_history (employee_id, point_requested, money_received, status) VALUES
(11, 100, 50000, 'pending'),
(12, 200, 100000, 'approved');
