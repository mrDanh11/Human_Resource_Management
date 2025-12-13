CREATE EXTENSION IF NOT EXISTS pgcrypto;
use hrm_database;
INSERT INTO user_accounts (
    employee_id,
    username,
    password_hash,
    is_active,
    is_verified,
    last_login,
    failed_login_attempts,
    locked_until,
    created_at,
    updated_at
) VALUES (
    3,                                         -- employee_id (phải tồn tại trong bảng employee)
    'manager',                                 -- username (unique)
    crypt('123456', gen_salt('bf')),       -- password_hash (hash bằng bcrypt)
    true,
    false,
    NULL,
    0,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);


INSERT INTO user_accounts (
    employee_id,
    username,
    password_hash,
    is_active,
    is_verified,
    last_login,
    failed_login_attempts,
    locked_until,
    created_at,
    updated_at
) VALUES (
    6,                                         -- employee_id (phải tồn tại trong bảng employee)
    'employee',                                 -- username (unique)
    crypt('123456', gen_salt('bf')),       -- password_hash (hash bằng bcrypt)
    true,
    false,
    NULL,
    0,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);


INSERT INTO user_accounts (
    employee_id,
    username,
    password_hash,
    is_active,
    is_verified,
    last_login,
    failed_login_attempts,
    locked_until,
    created_at,
    updated_at
) VALUES (
    2,                                         -- employee_id (phải tồn tại trong bảng employee)
    'hr',                                 -- username (unique)
    crypt('123456', gen_salt('bf')),       -- password_hash (hash bằng bcrypt)
    true,
    false,
    NULL,
    0,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);


INSERT INTO user_accounts (
    employee_id,
    username,
    password_hash,
    is_active,
    is_verified,
    last_login,
    failed_login_attempts,
    locked_until,
    created_at,
    updated_at
) VALUES (
    1,                                         -- employee_id (phải tồn tại trong bảng employee)
    'admin',                                 -- username (unique)
    crypt('123456', gen_salt('bf')),       -- password_hash (hash bằng bcrypt)
    true,
    false,
    NULL,
    0,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);