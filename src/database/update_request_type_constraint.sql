-- FIX: Update check constraint to allow new leave types
-- Run this in your database tool (pgAdmin, DBeaver...)

-- 1. Drop the old constraint
ALTER TABLE request DROP CONSTRAINT IF EXISTS request_type_check;

-- 2. Add new constraint with expanded values
ALTER TABLE request ADD CONSTRAINT request_type_check 
CHECK (type IN (
    'wfh', 'leave', 'overtime', 'attendance_correction', 'equipment', 'other', -- Old types
    'LEAVE_ANNUAL', 'LEAVE_SICK', 'LEAVE_UNPAID', 'LEAVE_SATURDAY'             -- New types
));
