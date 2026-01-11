-- Fix: Allow 'cancelled' status for requests
-- Run this in your database tool

-- 1. Drop old constraint
ALTER TABLE request DROP CONSTRAINT IF EXISTS request_status_check;

-- 2. Add new constraint
ALTER TABLE request ADD CONSTRAINT request_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled'));
