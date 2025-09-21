import pool from '../config/db.js';

export async function listCategories(activeOnly = true) {
  const where = activeOnly ? 'WHERE is_active = 1' : '';
  const [rows] = await pool.query(
    `SELECT id, name, slug, is_active, created_at, updated_at FROM categories ${where} ORDER BY name`
  );
  return rows;
}

export async function getCategoryById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, slug, is_active, created_at, updated_at FROM categories WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

export async function createCategory({ name, slug, is_active = 1 }) {
  const [result] = await pool.query(
    'INSERT INTO categories (name, slug, is_active) VALUES (?, ?, ?)',
    [name, slug, is_active ? 1 : 0]
  );
  return result.insertId;
}

export async function updateCategory(id, { name, slug, is_active }) {
  const [result] = await pool.query(
    'UPDATE categories SET name = ?, slug = ?, is_active = ? WHERE id = ?',
    [name, slug, is_active ? 1 : 0, id]
  );
  return result.affectedRows > 0;
}

export async function deleteCategory(id) {
  const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
