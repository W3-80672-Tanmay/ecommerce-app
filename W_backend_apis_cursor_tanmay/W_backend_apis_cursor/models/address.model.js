import pool from '../config/db.js';

export async function listAddresses(userId) {
  const [rows] = await pool.query('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC', [userId]);
  return rows;
}

export async function createAddress(userId, address) {
  const {
    full_name, phone, line1, line2, city, state, postal_code, country, is_default = 0
  } = address;
  if (is_default) {
    await pool.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);
  }
  const [res] = await pool.query(
    `INSERT INTO addresses (user_id, full_name, phone, line1, line2, city, state, postal_code, country, is_default)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, full_name, phone, line1, line2 || null, city, state, postal_code, country, is_default ? 1 : 0]
  );
  return res.insertId;
}

export async function updateAddress(userId, id, address) {
  const {
    full_name, phone, line1, line2, city, state, postal_code, country, is_default
  } = address;
  if (is_default) {
    await pool.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);
  }
  const [res] = await pool.query(
    `UPDATE addresses SET full_name=?, phone=?, line1=?, line2=?, city=?, state=?, postal_code=?, country=?, is_default=?
     WHERE id=? AND user_id=?`,
    [full_name, phone, line1, line2 || null, city, state, postal_code, country, is_default ? 1 : 0, id, userId]
  );
  return res.affectedRows > 0;
}

export async function deleteAddress(userId, id) {
  const [res] = await pool.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [id, userId]);
  return res.affectedRows > 0;
}

export async function getAddressById(userId, id) {
  const [rows] = await pool.query('SELECT * FROM addresses WHERE id = ? AND user_id = ?', [id, userId]);
  return rows[0] || null;
}
