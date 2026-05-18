import mysql from "mysql2/promise";
import type { Pool } from "mysql2/promise";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { adminTourCategoryPresets } from "@/data/adminCategories";
import { defaultTeamMembers } from "@/data/teamMembers";

const DEFAULT_DB_HOST = process.env.MYSQL_HOST ?? "127.0.0.1";
const DEFAULT_DB_PORT = Number(process.env.MYSQL_PORT ?? "3306");
const DEFAULT_DB_USER = process.env.MYSQL_USER ?? "root";
const DEFAULT_DB_PASSWORD = process.env.MYSQL_PASSWORD ?? "root";
const DEFAULT_DB_NAME = process.env.MYSQL_DATABASE ?? "paranjpe_tours";
const DB_SCHEMA_VERSION = "paranjpe-cms-v8";

const SCRYPT_KEY_LENGTH = 64;

type GlobalWithDatabase = typeof globalThis & {
  __paranjpeMysqlPool?: Pool;
  __paranjpeMysqlReady?: Promise<Pool>;
  __paranjpeMysqlSchemaReady?: Promise<void>;
  __paranjpeMysqlSchemaVersion?: string;
};

function assertSafeIdentifier(identifier: string) {
  if (!/^[a-zA-Z0-9_]+$/.test(identifier)) {
    throw new Error("MYSQL_DATABASE must contain only letters, numbers or underscores.");
  }

  return `\`${identifier}\``;
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

async function seedDefaultAdmin(pool: Pool) {
  const [rows] = await pool.query<any[]>("SELECT COUNT(*) AS count FROM admins");
  if (rows[0]?.count > 0) {
    return;
  }

  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const passwordHash = hashPassword(password);

  await pool.execute(
    "INSERT INTO admins (username, password_hash, display_name) VALUES (?, ?, ?)",
    [username, passwordHash, "Administrator"],
  );
}

async function seedDefaultCategories(pool: Pool) {
  for (const category of adminTourCategoryPresets) {
    await pool.execute(
      `
        INSERT INTO categories (name, slug, description)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          slug = VALUES(slug),
          description = IF(categories.description = '', VALUES(description), categories.description)
      `,
      [category.name, category.slug, category.description],
    );
  }
}

async function seedDefaultTeamMembers(pool: Pool) {
  for (const member of defaultTeamMembers) {
    await pool.execute(
      `
        INSERT IGNORE INTO about_team_members (slug, name, role, description)
        VALUES (?, ?, ?, ?)
      `,
      [member.slug, member.name, member.role, member.description],
    );
  }
}

async function hasTableColumn(pool: Pool, tableName: string, columnName: string) {
  const [rows] = await pool.query<any[]>(
    `
      SELECT 1
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
      LIMIT 1
    `,
    [tableName, columnName],
  );

  return rows.length > 0;
}

async function ensureCmsToursColumns(pool: Pool) {
  const hasTourDate = await hasTableColumn(pool, "cms_tours", "tour_date");
  if (!hasTourDate) {
    await pool.execute("ALTER TABLE cms_tours ADD COLUMN tour_date DATE NULL AFTER duration");
  }

  const hasTourDateLabel = await hasTableColumn(pool, "cms_tours", "tour_date_label");
  if (!hasTourDateLabel) {
    await pool.execute("ALTER TABLE cms_tours ADD COLUMN tour_date_label VARCHAR(255) NULL AFTER tour_date");
  }

  const hasBookingUrl = await hasTableColumn(pool, "cms_tours", "booking_url");
  if (!hasBookingUrl) {
    await pool.execute("ALTER TABLE cms_tours ADD COLUMN booking_url LONGTEXT NULL AFTER tour_date_label");
  }

  const hasStatus = await hasTableColumn(pool, "cms_tours", "status");
  if (!hasStatus) {
    await pool.execute(
      "ALTER TABLE cms_tours ADD COLUMN status VARCHAR(24) NOT NULL DEFAULT 'published' AFTER booking_url",
    );
  }
}

async function createTables(pool: Pool) {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(120) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      display_name VARCHAR(160) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS cms_testimonials (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS about_team_members (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS legacy_content_visibility (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      content_type VARCHAR(40) NOT NULL,
      legacy_key VARCHAR(255) NOT NULL,
      hidden TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_legacy_content_visibility (content_type, legacy_key),
      INDEX idx_legacy_content_visibility_hidden (hidden)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute("ALTER TABLE cms_tours MODIFY image LONGTEXT NOT NULL");
  await pool.execute("ALTER TABLE shop_items MODIFY image LONGTEXT NOT NULL");
  await pool.execute("ALTER TABLE blogs MODIFY image LONGTEXT NOT NULL");
  await pool.execute("ALTER TABLE cms_gallery_items MODIFY image LONGTEXT NOT NULL");
  await ensureCmsToursColumns(pool);
}

async function createDatabaseIfNeeded() {
  const bootstrap = await mysql.createConnection({
    host: DEFAULT_DB_HOST,
    port: DEFAULT_DB_PORT,
    user: DEFAULT_DB_USER,
    password: DEFAULT_DB_PASSWORD,
    connectTimeout: 5000,
  });

  try {
    await bootstrap.query(
      `CREATE DATABASE IF NOT EXISTS ${assertSafeIdentifier(DEFAULT_DB_NAME)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
  } finally {
    await bootstrap.end();
  }
}

async function initializePool() {
  await createDatabaseIfNeeded();

  const pool = mysql.createPool({
    host: DEFAULT_DB_HOST,
    port: DEFAULT_DB_PORT,
    user: DEFAULT_DB_USER,
    password: DEFAULT_DB_PASSWORD,
    database: DEFAULT_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 5000,
  });

  await createTables(pool);
  await seedDefaultAdmin(pool);
  await seedDefaultCategories(pool);
  await seedDefaultTeamMembers(pool);

  return pool;
}

export async function getPool() {
  const globalScope = globalThis as GlobalWithDatabase;

  if (!globalScope.__paranjpeMysqlReady) {
    globalScope.__paranjpeMysqlReady = initializePool().then((pool) => {
      globalScope.__paranjpeMysqlPool = pool;
      return pool;
    });
  }

  const pool = await globalScope.__paranjpeMysqlReady;

  if (globalScope.__paranjpeMysqlSchemaVersion !== DB_SCHEMA_VERSION) {
    if (!globalScope.__paranjpeMysqlSchemaReady) {
      globalScope.__paranjpeMysqlSchemaReady = (async () => {
        await createTables(pool);
        await seedDefaultAdmin(pool);
        await seedDefaultCategories(pool);
        await seedDefaultTeamMembers(pool);
        globalScope.__paranjpeMysqlSchemaVersion = DB_SCHEMA_VERSION;
      })().finally(() => {
        globalScope.__paranjpeMysqlSchemaReady = undefined;
      });
    }

    await globalScope.__paranjpeMysqlSchemaReady;
  }

  return pool;
}

export function verifyStoredPassword(password: string, storedHash: string) {
  const [scheme, salt, hash] = storedHash.split(":");
  if (scheme !== "scrypt" || !salt || !hash) {
    return false;
  }

  const incomingHash = scryptSync(password, salt, SCRYPT_KEY_LENGTH);
  const storedBuffer = Buffer.from(hash, "hex");

  if (incomingHash.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(incomingHash, storedBuffer);
}
