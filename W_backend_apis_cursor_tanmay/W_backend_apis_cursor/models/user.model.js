import pool from '../config/db.js';

export async function findOrCreateUserByPhone(phone) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT id, phone, name, is_active, created_at FROM users WHERE phone = ?', [phone]);
    if (rows.length) {
      await conn.commit();
      return rows[0];
    }
    const [result] = await conn.query('INSERT INTO users (phone, is_active) VALUES (?, 1)', [phone]);
    const [created] = await conn.query('SELECT id, phone, name, is_active, created_at FROM users WHERE id = ?', [result.insertId]);
    await conn.commit();
    return created[0];
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export async function getUserById(userId) {
  const [rows] = await pool.query('SELECT id, phone, name, is_active, created_at FROM users WHERE id = ?', [userId]);
  return rows[0] || null;
}
