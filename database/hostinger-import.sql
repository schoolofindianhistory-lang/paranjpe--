-- Paranjape Tours database import for Hostinger/phpMyAdmin.
-- Import this file into the selected Hostinger MySQL database.
-- It creates the tables required by the React + Node admin backend.
-- It does not drop existing tables or delete existing data.

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

CREATE TABLE IF NOT EXISTS admin_sessions (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  admin_id INT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_admin_sessions_expires_at (expires_at),
  CONSTRAINT fk_admin_sessions_admin
    FOREIGN KEY (admin_id) REFERENCES admins(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_tours (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  category_id INT UNSIGNED NULL,
  category_label VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  duration VARCHAR(255) NOT NULL,
  tour_date DATE NULL,
  tour_date_label VARCHAR(255) NULL,
  booking_url LONGTEXT NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'published',
  difficulty VARCHAR(255) NOT NULL,
  best_for VARCHAR(255) NOT NULL,
  best_season VARCHAR(255) NOT NULL,
  group_size VARCHAR(255) NOT NULL,
  price VARCHAR(255) NOT NULL,
  image LONGTEXT NOT NULL,
  gallery_json JSON NOT NULL,
  short_description TEXT NOT NULL,
  overview TEXT NOT NULL,
  history LONGTEXT NOT NULL,
  highlights_json JSON NOT NULL,
  itinerary_json JSON NOT NULL,
  inclusions_json JSON NOT NULL,
  exclusions_json JSON NOT NULL,
  carry_json JSON NOT NULL,
  who_can_join TEXT NOT NULL,
  faqs_json JSON NOT NULL,
  notes_json JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_cms_tours_category_id (category_id),
  CONSTRAINT fk_cms_tours_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_testimonials (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS about_team_members (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS shop_items (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  badge VARCHAR(255) NOT NULL,
  price VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image LONGTEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blogs (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content LONGTEXT NOT NULL,
  image LONGTEXT NOT NULL,
  published_on DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS legacy_content_visibility (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  content_type VARCHAR(40) NOT NULL,
  legacy_key VARCHAR(255) NOT NULL,
  hidden TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_legacy_content_visibility (content_type, legacy_key),
  INDEX idx_legacy_content_visibility_hidden (hidden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_enquiries (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  category_value VARCHAR(80) NOT NULL,
  category_label VARCHAR(160) NOT NULL,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  preferred_contact_method VARCHAR(40) NOT NULL,
  organization_name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  schedule_details VARCHAR(255) NOT NULL,
  group_details VARCHAR(160) NOT NULL,
  location_details VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_contact_enquiries_created_at (created_at),
  INDEX idx_contact_enquiries_status (status),
  INDEX idx_contact_enquiries_category (category_value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_gallery_items (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  image LONGTEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 100,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_cms_gallery_items_sort_order (sort_order),
  INDEX idx_cms_gallery_items_is_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_hero_section_settings (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  desktop_image LONGTEXT NOT NULL,
  mobile_image LONGTEXT NULL,
  heading VARCHAR(255) NOT NULL,
  subheading TEXT NOT NULL,
  cta_text VARCHAR(160) NOT NULL,
  cta_link VARCHAR(600) NOT NULL,
  overlay_opacity DECIMAL(4,2) NOT NULL DEFAULT 0.35,
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
  display_name = VALUES(display_name);

INSERT INTO categories (name, slug, description)
VALUES
  ('One Day Tour', 'one-day-tour', 'Short format trips and excursions that begin and finish the same day.'),
  ('Heritage Walk', 'heritage-walk', 'Story-led walking tours focused on culture, architecture and local history.'),
  ('Multiple Day Tour', 'multiple-day-tour', 'Longer journeys with overnight stays, deeper exploration and full itineraries.')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = IF(categories.description = '', VALUES(description), categories.description);

INSERT IGNORE INTO about_team_members (slug, name, role, description)
VALUES
  ('archana-kulkarni', 'Archana Kulkarni', 'MA Indology, Diploma in Tourism', 'A travel enthusiast with a passion for history. Excellent team leader'),
  ('aditya-naniwadekar', 'Aditya Naniwadekar', 'Botanist', 'Core wildlife expert and 15+ years of experience in Travel Industry'),
  ('amogh-vaidya', 'Amogh Vaidya', 'MA Indology, MA Sanskrit, pursuing PHD', '8+ years of experience in the heritage segment'),
  ('gayatri-bhalerao', 'Gayatri Bhalerao', 'MA Indology', '3+ years of experience in the heritage segment'),
  ('bakul-joshi', 'Bakul Joshi', 'MA Indology', '5+ years of experience in the heritage segment'),
  ('mukta-gogate', 'Mukta Gogate', 'CA', 'Finance expert by profession but handles back office effectively');
