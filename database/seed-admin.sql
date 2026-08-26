-- Paranjape Tours admin seed/reset file.
-- Import this in phpMyAdmin after hostinger-import.sql.
-- It creates/resets the website admin login:
-- username: admin
-- password: admin123

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS admins (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(160) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO admins (username, password_hash, display_name)
VALUES (
  'admin',
  'scrypt:d1ff883fee25c40dd936b76ccae55203:1dfe92bb382fb9604548f300e82a09ba326d7fa4c97381292346fc6a62cf521a004732a6af8560396213e6e217ba60f65700771fd2a21b3be499ea8aafde66d7',
  'Administrator'
)
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  display_name = VALUES(display_name),
  updated_at = CURRENT_TIMESTAMP;

DELETE FROM admin_sessions;
