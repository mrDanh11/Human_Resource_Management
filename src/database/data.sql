-- Insert departments without manager_id first
INSERT INTO department (id, name, manager_id, created_at, updated_at) VALUES (1, 'Engineering', NULL, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO department (id, name, manager_id, created_at, updated_at) VALUES (2, 'Human Resources', NULL, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO department (id, name, manager_id, created_at, updated_at) VALUES (3, 'Sales', NULL, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO department (id, name, manager_id, created_at, updated_at) VALUES (4, 'Marketing', NULL, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO department (id, name, manager_id, created_at, updated_at) VALUES (5, 'Finance', NULL, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');


INSERT INTO role VALUES (1, 'admin', 'System administrator', '2026-01-03 17:07:21.33979');
INSERT INTO role VALUES (2, 'hr', 'Human resources manager', '2026-01-03 17:07:21.33979');
INSERT INTO role VALUES (3, 'manager', 'Department manager', '2026-01-03 17:07:21.33979');
INSERT INTO role VALUES (4, 'employee', 'Regular employee', '2026-01-03 17:07:21.33979');


-- Insert employees without manager_id first
INSERT INTO employee (id, fullname, cccd, tax_code, phone, address, bank_account, join_date, status, birthday, gender, email, role_id, department_id, created_at, updated_at, manager_id) VALUES (1, 'Nguyen Van Admin', '001234567890', '0123456789001', '0901234567', '123 Admin St, HCMC', '1234567890', '2020-01-15', 'active', '1985-05-20', 'male', 'admin@company.com', 1, 1, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979', NULL);
INSERT INTO employee (id, fullname, cccd, tax_code, phone, address, bank_account, join_date, status, birthday, gender, email, role_id, department_id, created_at, updated_at, manager_id) VALUES (2, 'Tran Thi HR', '002234567891', '0123456789002', '0901234568', '456 HR Ave, HCMC', '1234567891', '2020-03-01', 'active', '1988-08-15', 'female', 'hr@company.com', 2, 2, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:50.673041', NULL);
INSERT INTO employee (id, fullname, cccd, tax_code, phone, address, bank_account, join_date, status, birthday, gender, email, role_id, department_id, created_at, updated_at, manager_id) VALUES (3, 'Le Van Manager1', '003234567892', '0123456789003', '0901234569', '789 Manager Rd, HCMC', '1234567892', '2020-02-10', 'active', '1983-11-30', 'male', 'manager1@company.com', 3, 1, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:50.673041', NULL);
INSERT INTO employee (id, fullname, cccd, tax_code, phone, address, bank_account, join_date, status, birthday, gender, email, role_id, department_id, created_at, updated_at, manager_id) VALUES (4, 'Pham Thi Manager2', '004234567893', '0123456789004', '0901234570', '321 Manager Blvd, HCMC', '1234567893', '2020-04-20', 'active', '1986-03-25', 'female', 'manager2@company.com', 3, 3, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:50.673041', NULL);
INSERT INTO employee (id, fullname, cccd, tax_code, phone, address, bank_account, join_date, status, birthday, gender, email, role_id, department_id, created_at, updated_at, manager_id) VALUES (5, 'Hoang Van Manager3', '005234567894', '0123456789005', '0901234571', '654 Manager Way, HCMC', '1234567894', '2020-05-15', 'active', '1984-07-12', 'male', 'manager3@company.com', 3, 5, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:50.673041', NULL);
INSERT INTO employee (id, fullname, cccd, tax_code, phone, address, bank_account, join_date, status, birthday, gender, email, role_id, department_id, created_at, updated_at, manager_id) VALUES (6, 'Nguyen Van Emp1', '006234567895', '0123456789006', '0901234572', '111 Employee St, HCMC', '1234567895', '2021-01-10', 'active', '1990-01-15', 'male', 'emp1@company.com', 4, 1, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:50.673041', NULL);
INSERT INTO employee (id, fullname, cccd, tax_code, phone, address, bank_account, join_date, status, birthday, gender, email, role_id, department_id, created_at, updated_at, manager_id) VALUES (7, 'Tran Thi Emp2', '007234567896', '0123456789007', '0901234573', '222 Employee Ave, HCMC', '1234567896', '2021-02-20', 'active', '1992-06-20', 'female', 'emp2@company.com', 4, 1, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:50.673041', NULL);
INSERT INTO employee (id, fullname, cccd, tax_code, phone, address, bank_account, join_date, status, birthday, gender, email, role_id, department_id, created_at, updated_at, manager_id) VALUES (8, 'Le Van Emp3', '008234567897', '0123456789008', '0901234574', '333 Employee Rd, HCMC', '1234567897', '2021-03-15', 'active', '1991-09-10', 'male', 'emp3@company.com', 4, 3, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:50.673041', NULL);
INSERT INTO employee (id, fullname, cccd, tax_code, phone, address, bank_account, join_date, status, birthday, gender, email, role_id, department_id, created_at, updated_at, manager_id) VALUES (9, 'Pham Thi Emp4', '009234567898', '0123456789009', '0901234575', '444 Employee Blvd, HCMC', '1234567898', '2021-04-25', 'active', '1993-12-05', 'female', 'emp4@company.com', 4, 3, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:50.673041', NULL);
INSERT INTO employee (id, fullname, cccd, tax_code, phone, address, bank_account, join_date, status, birthday, gender, email, role_id, department_id, created_at, updated_at, manager_id) VALUES (10, 'Hoang Van Emp5', '010234567899', '0123456789010', '0901234576', '555 Employee Way, HCMC', '1234567899', '2021-05-30', 'active', '1989-04-18', 'male', 'emp5@company.com', 4, 5, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:50.673041', NULL);
INSERT INTO employee (id, fullname, cccd, tax_code, phone, address, bank_account, join_date, status, birthday, gender, email, role_id, department_id, created_at, updated_at, manager_id) VALUES (11, 'Nguyen Van Dev1', '011234567890', '0123456789011', '0901234581', '111 Dev Lane, HCMC', '1234567811', '2022-01-15', 'active', '1995-05-20', 'male', 'dev1@company.com', 4, 1, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007', NULL);
INSERT INTO employee (id, fullname, cccd, tax_code, phone, address, bank_account, join_date, status, birthday, gender, email, role_id, department_id, created_at, updated_at, manager_id) VALUES (12, 'Tran Thi Dev2', '012234567891', '0123456789012', '0901234582', '222 Dev Lane, HCMC', '1234567812', '2022-02-20', 'active', '1996-08-15', 'female', 'dev2@company.com', 4, 1, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007', NULL);
INSERT INTO employee (id, fullname, cccd, tax_code, phone, address, bank_account, join_date, status, birthday, gender, email, role_id, department_id, created_at, updated_at, manager_id) VALUES (13, 'Le Van Sales1', '013234567892', '0123456789013', '0901234583', '333 Sales St, HCMC', '1234567813', '2022-03-10', 'active', '1994-11-30', 'male', 'sales1@company.com', 4, 3, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007', NULL);
INSERT INTO employee (id, fullname, cccd, tax_code, phone, address, bank_account, join_date, status, birthday, gender, email, role_id, department_id, created_at, updated_at, manager_id) VALUES (14, 'Pham Thi Sales2', '014234567893', '0123456789014', '0901234584', '444 Sales St, HCMC', '1234567814', '2022-04-25', 'active', '1997-03-25', 'female', 'sales2@company.com', 4, 3, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007', NULL);
INSERT INTO employee (id, fullname, cccd, tax_code, phone, address, bank_account, join_date, status, birthday, gender, email, role_id, department_id, created_at, updated_at, manager_id) VALUES (15, 'Hoang Van Mkt1', '015234567894', '0123456789015', '0901234585', '555 Mkt Rd, HCMC', '1234567815', '2022-05-15', 'active', '1993-07-12', 'male', 'mkt1@company.com', 4, 4, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007', NULL);
INSERT INTO employee (id, fullname, cccd, tax_code, phone, address, bank_account, join_date, status, birthday, gender, email, role_id, department_id, created_at, updated_at, manager_id) VALUES (16, 'Nguyen Thi Mkt2', '016234567895', '0123456789016', '0901234586', '666 Mkt Rd, HCMC', '1234567816', '2022-06-10', 'active', '1998-01-15', 'female', 'mkt2@company.com', 4, 4, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007', NULL);
INSERT INTO employee (id, fullname, cccd, tax_code, phone, address, bank_account, join_date, status, birthday, gender, email, role_id, department_id, created_at, updated_at, manager_id) VALUES (17, 'Tran Van Fin1', '017234567896', '0123456789017', '0901234587', '777 Fin Blvd, HCMC', '1234567817', '2022-07-20', 'active', '1992-06-20', 'male', 'fin1@company.com', 4, 5, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007', NULL);
INSERT INTO employee (id, fullname, cccd, tax_code, phone, address, bank_account, join_date, status, birthday, gender, email, role_id, department_id, created_at, updated_at, manager_id) VALUES (18, 'Le Thi Fin2', '018234567897', '0123456789018', '0901234588', '888 Fin Blvd, HCMC', '1234567818', '2022-08-15', 'active', '1995-09-10', 'female', 'fin2@company.com', 4, 5, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007', NULL);
INSERT INTO employee (id, fullname, cccd, tax_code, phone, address, bank_account, join_date, status, birthday, gender, email, role_id, department_id, created_at, updated_at, manager_id) VALUES (19, 'Pham Van HR1', '019234567898', '0123456789019', '0901234589', '999 HR Way, HCMC', '1234567819', '2022-09-25', 'active', '1991-12-05', 'male', 'hr1@company.com', 4, 2, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007', NULL);
INSERT INTO employee (id, fullname, cccd, tax_code, phone, address, bank_account, join_date, status, birthday, gender, email, role_id, department_id, created_at, updated_at, manager_id) VALUES (20, 'Hoang Thi HR2', '020234567899', '0123456789020', '0901234590', '000 HR Way, HCMC', '1234567820', '2022-10-30', 'active', '1996-04-18', 'female', 'hr2@company.com', 4, 2, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007', NULL);

-- Update manager_id after all employees are inserted
UPDATE employee SET manager_id = 1 WHERE id IN (2, 3, 4, 5);
UPDATE employee SET manager_id = 3 WHERE id IN (6, 7, 11, 12, 15, 16);
UPDATE employee SET manager_id = 4 WHERE id IN (8, 9, 13, 14);
UPDATE employee SET manager_id = 5 WHERE id IN (10, 17, 18);
UPDATE employee SET manager_id = 2 WHERE id IN (19, 20);

-- Update department manager_id after employees are inserted
UPDATE department SET manager_id = 3 WHERE id = 1;  -- Engineering -> Manager1
UPDATE department SET manager_id = 2 WHERE id = 2;  -- Human Resources -> HR
UPDATE department SET manager_id = 4 WHERE id = 3;  -- Sales -> Manager2
UPDATE department SET manager_id = 3 WHERE id = 4;  -- Marketing -> Manager1
UPDATE department SET manager_id = 5 WHERE id = 5;  -- Finance -> Manager3


INSERT INTO activity VALUES (1, 'Chạy bộ vì sức khỏe', 'Chương trình chạy bộ marathon nhằm nâng cao sức khỏe và tinh thần đồng đội. Tất cả nhân viên đều có thể tham gia.', '2025-01-15 06:00:00', '2025-01-15 10:00:00', '2024-12-10 00:00:00', '2025-12-25 23:59:59', 100, 'Công viên Thống Nhất', 'sports', 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800', 'Phòng Nhân sự', 50, 'ongoing', 2, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979', FALSE);
INSERT INTO activity VALUES (2, 'Từ thiện vùng cao', 'Chương trình từ thiện mang đến quà tặng, sách vở cho trẻ em vùng cao. Cùng nhau chia sẻ yêu thương.', '2026-01-20 07:00:00', '2026-01-22 18:00:00', '2025-12-01 00:00:00', '2026-01-15 23:59:59', 30, 'Sơn La, Lai Châu', 'charity', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800', 'Ban Đoàn thể', 100, 'upcoming', 2, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979', FALSE);
INSERT INTO activity VALUES (3, 'Workshop Kỹ năng lãnh đạo', 'Khóa đào tạo nâng cao kỹ năng lãnh đạo và quản lý nhóm cho các quản lý cấp trung.', '2025-01-18 08:00:00', '2025-01-18 17:00:00', '2024-12-10 00:00:00', '2025-12-20 23:59:59', 50, 'Phòng hội thảo A - Tầng 5', 'training', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', 'Phòng Đào tạo', 30, 'cancelled', 2, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979', FALSE);
INSERT INTO activity VALUES (4, 'Team Building Mùa Đông', 'Hoạt động team building với các trò chơi ngoài trời, BBQ và gala dinner tại resort.', '2026-02-01 08:00:00', '2026-02-02 16:00:00', '2025-12-01 00:00:00', '2026-01-25 23:59:59', 150, 'Legacy Yên Tử Resort, Quảng Ninh', 'team-building', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800', 'Ban Giám đốc', 80, 'upcoming', 1, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979', FALSE);
INSERT INTO activity VALUES (5, 'Hiến máu nhân đạo', 'Ngày hội hiến máu tình nguyện phối hợp cùng Viện Huyết học - Truyền máu TW.', '2025-01-25 08:00:00', '2025-01-25 16:00:00', '2024-12-10 00:00:00', '2025-12-23 23:59:59', 80, 'Hội trường Tầng 1', 'volunteer', 'https://images.unsplash.com/photo-1615461065929-4f8ffed6ca40?w=800', 'Phòng Y tế', 70, 'completed', 2, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO activity VALUES (6, 'Giải cầu lông nội bộ', 'Giải đấu cầu lông giao hữu giữa các phòng ban nhằm tăng cường sức khỏe và gắn kết.', '2026-02-10 14:00:00', '2026-02-10 18:00:00', '2025-12-10 00:00:00', '2026-02-05 23:59:59', 32, 'Nhà thi đấu Trịnh Hoài Đức', 'sports', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800', 'Câu lạc bộ Thể thao', 40, 'upcoming', 2, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979', FALSE);
INSERT INTO activity VALUES (7, 'Trồng cây xanh bảo vệ môi trường', 'Chiến dịch trồng 1000 cây xanh tại khu vực công nghiệp nhằm cải thiện môi trường làm việc.', '2026-01-28 07:00:00', '2026-01-28 11:00:00', '2025-12-10 00:00:00', '2026-01-26 23:59:59', 100, 'Khu công nghiệp Thăng Long', 'volunteer', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800', 'Ban Môi trường', 60, 'ongoing', 2, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979', FALSE);
INSERT INTO activity VALUES (8, 'Yoga buổi sáng', 'Lớp yoga định kỳ mỗi sáng thứ 7 giúp thư giãn và nâng cao sức khỏe tinh thần.', '2025-12-21 06:30:00', '2025-12-21 08:00:00', '2025-12-10 00:00:00', '2025-12-20 23:59:59', 40, 'Sân thượng Tầng 10', 'sports', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800', 'Câu lạc bộ Sức khỏe', 20, 'upcoming', 2, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979', FALSE);
INSERT INTO activity VALUES (9, 'Khóa học Excel nâng cao', 'Khóa đào tạo kỹ năng sử dụng Excel từ cơ bản đến nâng cao, bao gồm các hàm phức tạp và pivot table.', '2026-02-05 08:30:00', '2026-02-07 17:00:00', '2025-12-10 00:00:00', '2026-02-01 23:59:59', 60, 'Phòng máy tính B - Tầng 3', 'training', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', 'Phòng Đào tạo', 40, 'upcoming', 2, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979', FALSE);
INSERT INTO activity VALUES (10, 'Bơi lội mùa hè', 'Buổi tập bơi lội tập thể dành cho nhân viên và gia đình, có huấn luyện viên hướng dẫn.', '2026-02-15 08:00:00', '2026-02-15 11:00:00', '2025-12-10 00:00:00', '2026-02-12 23:59:59', 50, 'Bể bơi Mỹ Đình', 'sports', 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800', 'Câu lạc bộ Thể thao', 45, 'upcoming', 2, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979', FALSE);
INSERT INTO activity VALUES (11, 'Workshop Kỹ năng giao tiếp', 'Hội thảo nâng cao kỹ năng giao tiếp và thuyết trình hiệu quả trong môi trường công sở.', '2026-02-20 13:30:00', '2026-02-20 17:30:00', '2025-12-10 00:00:00', '2026-02-18 23:59:59', 45, 'Hội trường Tầng 2', 'training', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', 'Phòng Nhân sự', 35, 'upcoming', 2, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979', FALSE);
INSERT INTO activity VALUES (12, 'Dã ngoại cuối tuần', 'Chuyến du lịch ngắn ngày đến Tam Đảo, tham quan và nghỉ dưỡng cùng đồng nghiệp.', '2026-02-22 06:00:00', '2026-02-23 18:00:00', '2025-12-10 00:00:00', '2026-02-19 23:59:59', 80, 'Tam Đảo, Vĩnh Phúc', 'team-building', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800', 'Ban Đoàn thể', 65, 'upcoming', 2, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979', FALSE);
INSERT INTO activity VALUES (13, 'Tặng quà trung thu cho trẻ em', 'Chương trình trao tặng bánh trung thu và quà cho trẻ em có hoàn cảnh khó khăn.', '2025-09-10 08:00:00', '2025-09-10 16:00:00', '2024-12-16 00:00:00', '2025-09-05 23:59:59', 35, 'Trung tâm Bảo trợ trẻ em Hà Nội', 'charity', 'https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?w=800', 'Ban Đoàn thể', 85, 'completed', 2, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979', FALSE);
INSERT INTO activity VALUES (14, 'Hackathon 2025', 'Cuộc thi lập trình nội bộ dành cho khối kỹ thuật.', '2025-06-15 08:00:00', '2025-06-16 18:00:00', '2025-05-01 00:00:00', '2025-06-10 23:59:59', 50, 'Phòng họp lớn', 'training', 'https://images.unsplash.com/photo-1504384308090-c54be9852d85?w=800', 'Phòng Kỹ thuật', 150, 'upcoming', 3, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007', FALSE);
INSERT INTO activity VALUES (15, 'Giải bóng đá nam', 'Giải bóng đá thường niên.', '2025-07-01 17:00:00', '2025-07-30 19:00:00', '2025-06-01 00:00:00', '2025-06-25 23:59:59', 100, 'Sân vận động Mỹ Đình', 'sports', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800', 'Công đoàn', 100, 'upcoming', 2, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007', FALSE);
INSERT INTO activity VALUES (16, 'Quyên góp sách', 'Quyên góp sách cho thư viện vùng cao.', '2025-08-15 08:00:00', '2025-08-20 17:00:00', '2025-08-01 00:00:00', '2025-08-14 23:59:59', 200, 'Sảnh chính', 'charity', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800', 'Ban Từ thiện', 50, 'upcoming', 2, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007', FALSE);


INSERT INTO request VALUES (1, 6, 'WFH due to family matter', '2026-01-04 08:30:00', '2026-01-04 17:30:00', 'wfh', NULL, 'pending', '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO request VALUES (2, 7, 'Annual leave', '2026-01-08 00:00:00', '2026-01-10 23:59:59', 'leave', NULL, 'pending', '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO request VALUES (3, 8, 'Late check-in correction', '2026-01-02 08:30:00', '2026-01-02 17:30:00', 'attendance_correction', NULL, 'approved', '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO request VALUES (4, 11, 'Work from home due to sickness', '2026-01-05 08:30:00', '2026-01-05 17:30:00', 'wfh', NULL, 'approved', '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007');
INSERT INTO request VALUES (5, 13, 'Family vacation', '2026-01-13 00:00:00', '2026-01-15 23:59:59', 'leave', NULL, 'pending', '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007');
INSERT INTO request VALUES (6, 17, 'Closing financial reports', '2026-01-02 17:30:00', '2026-01-02 20:30:00', 'overtime', NULL, 'rejected', '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007');


INSERT INTO approval_history VALUES (1, 4, 3, 'approved', 'Take care', '2026-01-03 17:07:57.14007');
INSERT INTO approval_history VALUES (2, 6, 5, 'rejected', 'Not necessary at this time', '2026-01-03 17:07:57.14007');


INSERT INTO attendance VALUES (1, 6, '2025-12-28', '2025-12-28 08:30:00', '2025-12-28 17:45:00', 'present', NULL, 8.25, 0.75, NULL, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO attendance VALUES (2, 6, '2025-12-29', '2025-12-29 08:15:00', '2025-12-29 17:30:00', 'present', NULL, 8.25, 0, NULL, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO attendance VALUES (3, 7, '2025-12-28', '2025-12-28 08:20:00', '2025-12-28 17:30:00', 'present', NULL, 8.17, 0, NULL, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO attendance VALUES (4, 7, '2025-12-29', '2025-12-29 08:30:00', '2025-12-29 17:30:00', 'present', NULL, 8, 0, NULL, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO attendance VALUES (5, 11, '2026-01-02', '2026-01-02 08:25:00', '2026-01-02 17:35:00', 'present', NULL, 8.1, 0, NULL, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007');
INSERT INTO attendance VALUES (6, 11, '2026-01-01', '2026-01-01 08:30:00', '2026-01-01 17:30:00', 'present', NULL, 8, 0, NULL, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007');
INSERT INTO attendance VALUES (7, 13, '2026-01-02', '2026-01-02 08:45:00', '2026-01-02 17:45:00', 'late', NULL, 8, 0, NULL, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007');


INSERT INTO monthly_point_rules VALUES (1, 1, 200, true, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO monthly_point_rules VALUES (2, 2, 150, true, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO monthly_point_rules VALUES (3, 3, 150, true, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO monthly_point_rules VALUES (4, 4, 100, true, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');


INSERT INTO participation VALUES (4, 6, 1, '2026-01-03 17:07:21.33979', NULL, 'registered', NULL, NULL, '2026-01-03 17:07:21.33979');
INSERT INTO participation VALUES (5, 7, 1, '2026-01-03 17:07:21.33979', NULL, 'registered', NULL, NULL, '2026-01-03 17:07:21.33979');
INSERT INTO participation VALUES (1, 6, 3, '2026-01-03 17:07:21.33979', NULL, 'attended', 'good', '{"note": "Completed successfully"}', '2026-01-03 17:07:21.33979');
INSERT INTO participation VALUES (2, 7, 3, '2026-01-03 17:07:21.33979', NULL, 'attended', 'excellent', '{"note": "Completed successfully"}', '2026-01-03 17:07:21.33979');
INSERT INTO participation VALUES (3, 8, 3, '2026-01-03 17:07:21.33979', NULL, 'attended', 'good', '{"note": "Completed successfully"}', '2026-01-03 17:07:21.33979');
INSERT INTO participation VALUES (6, 8, 1, '2026-01-03 17:07:36.291708', NULL, 'attended', 'excellent', '{"note": "Personal best!", "rank": 15, "time": "01:23:45", "distance_km": 21.1, "pace_per_km": "00:03:58"}', '2026-01-03 17:07:36.291708');
INSERT INTO participation VALUES (7, 7, 10, '2026-01-03 17:07:36.291708', NULL, 'attended', 'good', '{"note": "Good performance", "rank": 8, "time": "00:32:15", "style": "freestyle", "distance_m": 1500}', '2026-01-03 17:07:36.291708');
INSERT INTO participation VALUES (8, 8, 4, '2026-01-03 17:07:36.291708', NULL, 'attended', 'excellent', '{"feedback": "Excellent participation and understanding", "quiz_score": 92, "completion_date": "2025-01-18", "attendance_hours": 8, "certificate_issued": true}', '2026-01-03 17:07:36.291708');
INSERT INTO participation VALUES (9, 9, 5, '2026-01-03 17:07:36.291708', NULL, 'attended', 'excellent', '{"impact": "Helped 25 donors", "recognition": "Outstanding volunteer", "tasks_completed": ["blood_donation", "registration_help"], "hours_contributed": 8}', '2026-01-03 17:07:36.291708');
INSERT INTO participation VALUES (10, 10, 4, '2026-01-03 17:07:36.291708', NULL, 'attended', 'good', '{"note": "Great teamwork!", "team_name": "Alpha Team", "team_rank": 2, "points_earned": 450, "activities_completed": ["obstacle_course", "cooking_challenge", "trivia"]}', '2026-01-03 17:07:36.291708');
INSERT INTO participation VALUES (11, 11, 14, '2026-01-03 17:07:57.14007', NULL, 'registered', NULL, NULL, '2026-01-03 17:07:57.14007');
INSERT INTO participation VALUES (12, 12, 14, '2026-01-03 17:07:57.14007', NULL, 'registered', NULL, NULL, '2026-01-03 17:07:57.14007');
INSERT INTO participation VALUES (13, 6, 14, '2026-01-03 17:07:57.14007', NULL, 'registered', NULL, NULL, '2026-01-03 17:07:57.14007');
INSERT INTO participation VALUES (14, 7, 14, '2026-01-03 17:07:57.14007', '2026-01-04 10:00:00', 'cancelled', NULL, NULL, '2026-01-03 17:07:57.14007');
INSERT INTO participation VALUES (15, 11, 16, '2026-01-03 17:07:57.14007', NULL, 'registered', NULL, NULL, '2026-01-03 17:07:57.14007');
INSERT INTO participation VALUES (16, 12, 16, '2026-01-03 17:07:57.14007', NULL, 'registered', NULL, NULL, '2026-01-03 17:07:57.14007');
INSERT INTO participation VALUES (17, 13, 16, '2026-01-03 17:07:57.14007', NULL, 'registered', NULL, NULL, '2026-01-03 17:07:57.14007');
INSERT INTO participation VALUES (18, 14, 16, '2026-01-03 17:07:57.14007', NULL, 'registered', NULL, NULL, '2026-01-03 17:07:57.14007');
INSERT INTO participation VALUES (19, 15, 16, '2026-01-03 17:07:57.14007', '2026-01-04 15:30:00', 'cancelled', NULL, NULL, '2026-01-03 17:07:57.14007');
INSERT INTO participation VALUES (20, 16, 16, '2026-01-03 17:07:57.14007', NULL, 'attended', 'bad', '{"note": "Late arrival, left early"}', '2026-01-03 17:07:57.14007');
INSERT INTO participation VALUES (21, 17, 16, '2026-01-03 17:07:57.14007', NULL, 'absent', NULL, NULL, '2026-01-03 17:07:57.14007');
INSERT INTO participation VALUES (22, 18, 16, '2026-01-03 17:07:57.14007', NULL, 'attended', 'good', '{"note": "Good contribution"}', '2026-01-03 17:07:57.14007');


INSERT INTO user_accounts VALUES (1, 1, 'admin', '$2a$06$cr3irbv7kMWhLiBQ.3Jl8.7kgn35MaMwlKNVtKHanj5Hpopi5eW2S', true, true, NULL, 0, NULL, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO user_accounts VALUES (2, 2, 'hr', '$2a$06$mDB92PJtpiSYsbRZNA0JEeheOmXfR51uZ54y.dj/SLJ0b181nYSai', true, true, NULL, 0, NULL, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO user_accounts VALUES (3, 3, 'manager1', '$2a$06$lyM43MhOH.16z7usML4iIuSh3q6ELIgPowmTpJhKjuUtesdqowp3K', true, true, NULL, 0, NULL, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO user_accounts VALUES (4, 4, 'manager2', '$2a$06$LJ4JO.Yqvm6hs/vRa5dMW.iih1DAtNl01u2PsoQ2WHd2P8Qki4juC', true, true, NULL, 0, NULL, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO user_accounts VALUES (5, 5, 'manager3', '$2a$06$xbff2lIZXEi2kom0FVHbAuYHvPS8Sry53mcGZZQil8uPCeP2NAPCq', true, true, NULL, 0, NULL, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO user_accounts VALUES (6, 6, 'emp1', '$2a$06$IxgHB.iepgohmbRd4npdAebguu4A8SRvfQQICoUyPMHsG.pO1nskS', true, true, NULL, 0, NULL, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO user_accounts VALUES (7, 7, 'emp2', '$2a$06$ETygYlpgTXKTErsO9XKjKO4rQXgVueGaQIr2JW.awt3cP81KwHmMu', true, true, NULL, 0, NULL, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO user_accounts VALUES (8, 8, 'emp3', '$2a$06$NS25cXGNzRBSXlilmZgHZu7ud8Eir4gNVJPRiE30zqOCHE54bwA.u', true, true, NULL, 0, NULL, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO user_accounts VALUES (9, 9, 'emp4', '$2a$06$CFwh4lp9jFdJsuPFWC18FOdX7fmLgncdpMxdDCn2cd88UVEgbg.Z2', true, true, NULL, 0, NULL, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO user_accounts VALUES (10, 10, 'emp5', '$2a$06$l69bjqpcqSDY.SbdDY1OLO2.BE.jOwRwoC8sdNPk.dKbZGek47JTe', true, true, NULL, 0, NULL, '2026-01-03 17:07:21.33979', '2026-01-03 17:07:21.33979');
INSERT INTO user_accounts VALUES (11, 11, 'dev1', '$2a$06$dobi2GUQdRqMsnlBk09GVet9qJg./24R3cz.BRUexMfHSMB5si2PO', true, true, NULL, 0, NULL, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007');
INSERT INTO user_accounts VALUES (12, 12, 'dev2', '$2a$06$/pthgCRQoFRAKjnVDzDfb.9dPH5vz9OCMryav.b9zHfF7kHwpnA0q', true, true, NULL, 0, NULL, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007');
INSERT INTO user_accounts VALUES (13, 13, 'sales1', '$2a$06$Ee3ueQJHVO5wFrWEXvZ9AuiJYl49meEmsG8IiL09CPfj93Tc1gUXq', true, true, NULL, 0, NULL, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007');
INSERT INTO user_accounts VALUES (14, 14, 'sales2', '$2a$06$AeuXpGG01Erad5hJLau2TeCPVvG9zPlr4Ozv0Mm0zqwSyRqxmVR6G', true, true, NULL, 0, NULL, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007');
INSERT INTO user_accounts VALUES (15, 15, 'mkt1', '$2a$06$jOnC.hRZWGpS3t0vFysAPO2uDvpXnFZSVQoA8yjPv3t36nUaZa45K', true, true, NULL, 0, NULL, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007');
INSERT INTO user_accounts VALUES (16, 16, 'mkt2', '$2a$06$AfgHGwiy8gu7Np4sy3tcdeDVCIo.RzUerPfSPXbluiY9cr6jCbNGu', true, true, NULL, 0, NULL, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007');
INSERT INTO user_accounts VALUES (17, 17, 'fin1', '$2a$06$j7Sz7l.8KlKHV5wBD0LHMeBSkIZgFtDdIJEyF6rxteE1VdRENXcuK', true, true, NULL, 0, NULL, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007');
INSERT INTO user_accounts VALUES (18, 18, 'fin2', '$2a$06$mycRogZpYuYj6c6Y5eSLS.AKec3tsXkXDpn.ZzYkyL1uKRvpRU.my', true, true, NULL, 0, NULL, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007');
INSERT INTO user_accounts VALUES (19, 19, 'hr1', '$2a$06$0fkREFxnz7UTDoOhcOlmVesbf28Uh1It.GH.krEQvtsdL.zowkR9q', true, true, NULL, 0, NULL, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007');
INSERT INTO user_accounts VALUES (20, 20, 'hr2', '$2a$06$v6BRn.DhtM/9bYSGoDGPQejLd00TL57Y4kgbI8SBfKW3XtRY2oKyC', true, true, NULL, 0, NULL, '2026-01-03 17:07:57.14007', '2026-01-03 17:07:57.14007');


INSERT INTO point VALUES (1, 1, 1500, '2026-01-03 17:07:21.33979');
INSERT INTO point VALUES (2, 2, 1200, '2026-01-03 17:07:21.33979');
INSERT INTO point VALUES (3, 3, 2000, '2026-01-03 17:07:21.33979');
INSERT INTO point VALUES (4, 4, 1800, '2026-01-03 17:07:21.33979');
INSERT INTO point VALUES (5, 5, 1600, '2026-01-03 17:07:21.33979');
INSERT INTO point VALUES (6, 6, 800, '2026-01-03 17:07:21.33979');
INSERT INTO point VALUES (7, 7, 950, '2026-01-03 17:07:21.33979');
INSERT INTO point VALUES (8, 8, 750, '2026-01-03 17:07:21.33979');
INSERT INTO point VALUES (9, 9, 1100, '2026-01-03 17:07:21.33979');
INSERT INTO point VALUES (10, 10, 650, '2026-01-03 17:07:21.33979');
INSERT INTO point VALUES (11, 11, 500, '2026-01-03 17:07:57.14007');
INSERT INTO point VALUES (12, 12, 600, '2026-01-03 17:07:57.14007');
INSERT INTO point VALUES (13, 13, 450, '2026-01-03 17:07:57.14007');
INSERT INTO point VALUES (14, 14, 700, '2026-01-03 17:07:57.14007');
INSERT INTO point VALUES (15, 15, 300, '2026-01-03 17:07:57.14007');
INSERT INTO point VALUES (16, 16, 800, '2026-01-03 17:07:57.14007');
INSERT INTO point VALUES (17, 17, 550, '2026-01-03 17:07:57.14007');
INSERT INTO point VALUES (18, 18, 900, '2026-01-03 17:07:57.14007');
INSERT INTO point VALUES (19, 19, 400, '2026-01-03 17:07:57.14007');
INSERT INTO point VALUES (20, 20, 650, '2026-01-03 17:07:57.14007');


INSERT INTO point_conversion_rules VALUES (1, 100, 50000, 1, '2026-01-03 17:07:21.33979', true);
INSERT INTO point_conversion_rules VALUES (2, 500, 250000, 1, '2026-01-03 17:07:21.33979', true);
INSERT INTO point_conversion_rules VALUES (3, 1000, 500000, 1, '2026-01-03 17:07:21.33979', true);


INSERT INTO point_to_money_history VALUES (1, 11, 100, 50000, 'pending', '2026-01-03 17:07:57.14007+07', NULL);
INSERT INTO point_to_money_history VALUES (2, 12, 200, 100000, 'approved', '2026-01-03 17:07:57.14007+07', NULL);


INSERT INTO point_transaction_history VALUES (1, 6, 500, 'earn', 3, 'Activity participation bonus', '2026-01-03 17:07:21.33979');
INSERT INTO point_transaction_history VALUES (2, 7, 300, 'earn', 3, 'Good performance', '2026-01-03 17:07:21.33979');
INSERT INTO point_transaction_history VALUES (3, 8, 400, 'earn', 4, 'Project completion', '2026-01-03 17:07:21.33979');
INSERT INTO point_transaction_history VALUES (4, 6, 200, 'earn', 3, 'Attendance bonus', '2026-01-03 17:07:21.33979');
INSERT INTO point_transaction_history VALUES (5, 9, 600, 'earn', 4, 'Sales achievement', '2026-01-03 17:07:21.33979');
INSERT INTO point_transaction_history VALUES (6, 10, 350, 'earn', 5, 'Monthly goal reached', '2026-01-03 17:07:21.33979');
INSERT INTO point_transaction_history VALUES (7, 11, 100, 'earn', 3, 'Welcome bonus', '2026-01-03 17:07:57.14007');
INSERT INTO point_transaction_history VALUES (8, 12, 100, 'earn', 3, 'Welcome bonus', '2026-01-03 17:07:57.14007');
INSERT INTO point_transaction_history VALUES (9, 13, 50, 'earn', 4, 'Sales target met', '2026-01-03 17:07:57.14007');


INSERT INTO refresh_tokens VALUES (1, 1, 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc2NzQzNjM1OCwiZXhwIjoxNzY4MDQxMTU4fQ.FOu3wk4aQid-48HKausRXAmgcSIQRMLa7lSnYV_Q7g4', '2026-01-10 17:32:38.888085', '2026-01-03 17:32:38.888085', false, NULL, 'Unknown', '192.168.1.10');
INSERT INTO refresh_tokens VALUES (2, 1, 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc2NzQzNjQxMCwiZXhwIjoxNzY4MDQxMjEwfQ.S1CTQV68_dWH7nfW4wINKGeUtnp99y67i-W4Sz4mK8o', '2026-01-10 17:33:30.803961', '2026-01-03 17:33:30.803961', false, NULL, 'Unknown', '192.168.1.10');
INSERT INTO refresh_tokens VALUES (3, 1, 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc2NzQzNjQ0MSwiZXhwIjoxNzY4MDQxMjQxfQ.eRMQe5NNNdXT_3ku09OWL2xjQPygm0m8yfIJEFlxKN4', '2026-01-10 17:34:01.69744', '2026-01-03 17:34:01.69744', false, NULL, 'Unknown', '192.168.1.10');
INSERT INTO refresh_tokens VALUES (4, 6, 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlbXAxIiwiaWF0IjoxNzY3NDM2NTUzLCJleHAiOjE3NjgwNDEzNTN9.3bpmvTduiLkY6CytOYF8ylL0LOm055lVRyEL4tP718A', '2026-01-10 17:35:53.626223', '2026-01-03 17:35:53.626223', false, NULL, 'Unknown', '192.168.1.10');
INSERT INTO refresh_tokens VALUES (5, 6, 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlbXAxIiwiaWF0IjoxNzY3NDM2NTY0LCJleHAiOjE3NjgwNDEzNjR9.9QbgCST7WhzcA1joVspItW-2bunNtBRg9EYtbmedwXw', '2026-01-10 17:36:04.314424', '2026-01-03 17:36:04.314424', false, NULL, 'Unknown', '192.168.1.10');
INSERT INTO refresh_tokens VALUES (6, 11, 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkZXYxIiwiaWF0IjoxNzY3NDM2NTk4LCJleHAiOjE3NjgwNDEzOTh9.RCYDMzY_AHxdI_DLAucFt5j4KPN-QgvsRIFzRjZB3Oc', '2026-01-10 17:36:38.187017', '2026-01-03 17:36:38.187017', false, NULL, 'Unknown', '192.168.1.10');
INSERT INTO refresh_tokens VALUES (7, 1, 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc2NzQ0NzcyOCwiZXhwIjoxNzY4MDUyNTI4fQ.Z3XriRXHbgFfr91f481wIrR2j3ZoSoiEm-DKJdCtIts', '2026-01-10 20:42:08.905902', '2026-01-03 20:42:08.905902', false, NULL, 'Unknown', '192.168.1.10');

DO $$
DECLARE
    r RECORD;
    max_val INTEGER;
BEGIN
    FOR r IN 
        SELECT table_name, column_name
        FROM information_schema.columns
        WHERE column_default LIKE 'nextval%'
          AND table_schema = 'public'
    LOOP
        EXECUTE format('SELECT COALESCE(MAX(%I), 0) FROM %I', 
                      r.column_name, r.table_name) INTO max_val;
        
        EXECUTE format('SELECT setval(pg_get_serial_sequence(%L, %L), %s)', 
                      r.table_name, r.column_name, GREATEST(max_val, 1));
        
        RAISE NOTICE 'Reset sequence for %.% to %', r.table_name, r.column_name, max_val;
    END LOOP;
END $$;