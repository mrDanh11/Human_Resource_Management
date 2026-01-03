-- Update Employees (Engineering) to report to Manager1 (ID: 3)
UPDATE employee SET manager_id = 3 WHERE id IN (6, 7);

-- Update Employees (Sales) to report to Manager2 (ID: 4)
UPDATE employee SET manager_id = 4 WHERE id IN (8, 9);

-- Update Employees (Finance) to report to Manager3 (ID: 5)
UPDATE employee SET manager_id = 5 WHERE id IN (10);

-- Update Managers and HR to report to Admin (ID: 1)
UPDATE employee SET manager_id = 1 WHERE id IN (2, 3, 4, 5);

-- Admin (ID: 1) has no manager (NULL)
