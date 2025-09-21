import pool from '../config/db.js';

export async function getAllSettings() {
  const [rows] = await pool.query('SELECT setting_key, setting_value FROM site_settings');
  const obj = {};
  for (const r of rows) obj[r.setting_key] = r.setting_value;
  return obj;
}

export async function upsertSetting(key, value) {
  await pool.query(
    `INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
    [key, value]
  );
  return true;
}
