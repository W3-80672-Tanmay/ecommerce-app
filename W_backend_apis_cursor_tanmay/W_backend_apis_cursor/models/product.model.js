import pool from '../config/db.js';

export async function listProducts({ activeOnly = true, featuredOnly = false, search = '', categoryId = null, page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;
  const where = [];
  const params = [];

  if (activeOnly) where.push('p.is_active = 1');
  if (featuredOnly) where.push('p.is_featured = 1');
  if (categoryId) {
    where.push('p.category_id = ?');
    params.push(categoryId);
  }
  if (search) {
    where.push('(p.name LIKE ? OR p.description LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const sql =
    `SELECT p.id, p.name, p.slug, p.description, p.price, p.stock_quantity, p.is_active, p.is_featured, p.category_id, p.created_at, p.updated_at,
            (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.position ASC, pi.id ASC LIMIT 1) AS thumbnail
     FROM products p
     ${whereSql}
     ORDER BY p.created_at DESC
     LIMIT ? OFFSET ?`;
  const countSql = `SELECT COUNT(*) as total FROM products p ${whereSql}`;

  const [countRows] = await pool.query(countSql, params);
  const total = countRows[0]?.total || 0;

  params.push(Number(limit), Number(offset));
  const [rows] = await pool.query(sql, params);

  return { total, items: rows, page, limit };
}

export async function getProductById(id) {
  const [rows] = await pool.query(
    `SELECT p.id, p.name, p.slug, p.description, p.price, p.stock_quantity, p.is_active, p.is_featured, p.category_id, p.created_at, p.updated_at
     FROM products p WHERE p.id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function getProductImages(productId) {
  const [rows] = await pool.query(
    'SELECT id, image_url, position, created_at FROM product_images WHERE product_id = ? ORDER BY position ASC, id ASC',
    [productId]
  );
  return rows;
}

export async function createProduct({ name, slug, description, price, stock_quantity, is_active = 1, is_featured = 0, category_id, images = [] }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      'INSERT INTO products (category_id, name, slug, description, price, stock_quantity, is_active, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [category_id, name, slug, description || null, price, stock_quantity || 0, is_active ? 1 : 0, is_featured ? 1 : 0]
    );
    const productId = result.insertId;
    for (let i = 0; i < images.length; i++) {
      await conn.query(
        'INSERT INTO product_images (product_id, image_url, position) VALUES (?, ?, ?)',
        [productId, images[i], i]
      );
    }
    await conn.commit();
    return productId;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export async function updateProduct(id, { name, slug, description, price, stock_quantity, is_active, is_featured, category_id, images }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      'UPDATE products SET category_id = ?, name = ?, slug = ?, description = ?, price = ?, stock_quantity = ?, is_active = ?, is_featured = ? WHERE id = ?',
      [category_id, name, slug, description || null, price, stock_quantity || 0, is_active ? 1 : 0, is_featured ? 1 : 0, id]
    );
    if (Array.isArray(images)) {
      await conn.query('DELETE FROM product_images WHERE product_id = ?', [id]);
      for (let i = 0; i < images.length; i++) {
        await conn.query('INSERT INTO product_images (product_id, image_url, position) VALUES (?, ?, ?)', [id, images[i], i]);
      }
    }
    await conn.commit();
    return true;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export async function deleteProduct(id) {
  const [res] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
  return res.affectedRows > 0;
}

export async function setProductActive(id, isActive) {
  const [res] = await pool.query('UPDATE products SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, id]);
  return res.affectedRows > 0;
}
