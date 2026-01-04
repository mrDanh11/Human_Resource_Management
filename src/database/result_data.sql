ALTER TABLE participation 
ADD COLUMN result_data JSONB;

-- 3. Migrate existing text data to JSONB
UPDATE participation 
SET result_data = jsonb_build_object('note', result)
WHERE result IS NOT NULL AND result != '';

-- 4. Drop old column and rename new one
ALTER TABLE participation DROP COLUMN result;
ALTER TABLE participation RENAME COLUMN result_data TO result;

-- 5. Add check constraint for valid structure
ALTER TABLE participation 
ADD CONSTRAINT check_result_structure 
CHECK (
    result IS NULL OR 
    jsonb_typeof(result) = 'object'
);

-- 6. Add GIN index for better JSONB query performance
CREATE INDEX idx_participation_result_gin ON participation USING GIN (result);

-- 7. Add helpful comment
COMMENT ON COLUMN participation.result IS 
'JSONB field storing activity-specific results. Examples:
- Sports: {"time": "00:45:30", "distance_km": 10, "rank": 3}
- Training: {"score": 85, "certificate": true, "completion_date": "2025-01-15"}
- Volunteer: {"hours": 8, "feedback": "Excellent contribution"}';

-- ============================================
-- EXAMPLE DATA INSERTS
-- ============================================

-- Running activity result
INSERT INTO participation (employee_id, activity_id, status, result)
VALUES (8, 1, 'attended', '{
    "time": "01:23:45",
    "distance_km": 21.1,
    "rank": 15,
    "pace_per_km": "00:03:58",
    "note": "Personal best!"
}'::jsonb);

-- Swimming activity result
INSERT INTO participation (employee_id, activity_id, status, result)
VALUES (7, 10, 'attended', '{
    "style": "freestyle",
    "distance_m": 1500,
    "time": "00:32:15",
    "rank": 8,
    "note": "Good performance"
}'::jsonb);

-- Training workshop result
INSERT INTO participation (employee_id, activity_id, status, result)
VALUES (8, 4, 'attended', '{
    "attendance_hours": 8,
    "quiz_score": 92,
    "certificate_issued": true,
    "completion_date": "2025-01-18",
    "feedback": "Excellent participation and understanding"
}'::jsonb);

-- Volunteer activity result
INSERT INTO participation (employee_id, activity_id, status, result)
VALUES (9, 5, 'attended', '{
    "hours_contributed": 8,
    "tasks_completed": ["blood_donation", "registration_help"],
    "impact": "Helped 25 donors",
    "recognition": "Outstanding volunteer"
}'::jsonb);

-- Team building result
INSERT INTO participation (employee_id, activity_id, status, result)
VALUES (10, 4, 'attended', '{
    "team_name": "Alpha Team",
    "team_rank": 2,
    "activities_completed": ["obstacle_course", "cooking_challenge", "trivia"],
    "points_earned": 450,
    "note": "Great teamwork!"
}'::jsonb);

ALTER TABLE point_conversion_rules
ALTER COLUMN money_value
TYPE NUMERIC
USING money_value::NUMERIC;

ALTER TABLE point_to_money_history
ALTER COLUMN money_received
TYPE NUMERIC
USING money_received::NUMERIC;

