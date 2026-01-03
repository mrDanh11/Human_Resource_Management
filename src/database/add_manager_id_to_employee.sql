-- Add manager_id column to employee table
ALTER TABLE employee
ADD COLUMN manager_id INTEGER;

-- Add foreign key constraint
ALTER TABLE employee
ADD CONSTRAINT fk_employee_manager
FOREIGN KEY (manager_id) REFERENCES employee(id);

-- Add index for better performance when querying by manager
CREATE INDEX idx_employee_manager ON employee(manager_id);
