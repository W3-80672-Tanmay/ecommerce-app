import pool from '../config/db.js';

export async function getAdminByEmail(email) {
  const [rows] = await pool.query('SELECT id, name, email, password_hash, is_active FROM admins WHERE email = ?', [email]);
  return rows[0] || null;
}

export async function createAdmin({ name, email, password_hash }) {
  const [res] = await pool.query(
    'INSERT INTO admins (name, email, password_hash, is_active) VALUES (?, ?, ?, 1)',
    [name, email, password_hash]
  );
  return res.insertId;
}

export async function hasAnyAdmin() {
  const [rows] = await pool.query('SELECT COUNT(*) as cnt FROM admins');
  return rows[0].cnt > 0;
}
