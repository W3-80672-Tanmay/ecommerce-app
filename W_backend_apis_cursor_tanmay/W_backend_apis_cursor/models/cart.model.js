import pool from '../config/db.js';

async function ensureCart(userId, conn) {
  const connection = conn || pool;
  const [rows] = await connection.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
  if (rows.length) return rows[0].id;
  const [res] = await connection.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
  return res.insertId;
}

export async function getCart(userId) {
  const cartId = await ensureCart(userId);
  const [items] = await pool.query(
    `SELECT ci.product_id, p.name, p.price, ci.quantity,
            (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY position ASC, id ASC LIMIT 1) AS thumbnail
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = ?`,
    [cartId]
  );
  return { cart_id: cartId, items };
}

export async function addToCart(userId, productId, quantity) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const cartId = await ensureCart(userId, conn);
    const [exists] = await conn.query('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);
    if (exists.length) {
      const newQty = exists[0].quantity + quantity;
      await conn.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, exists[0].id]);
    } else {
      await conn.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cartId, productId, quantity]);
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

export async function updateCartItem(userId, productId, quantity) {
  const cartId = await ensureCart(userId);
  if (quantity <= 0) {
    const [res] = await pool.query('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);
    return res.affectedRows > 0;
  }
  const [res] = await pool.query(
    'UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?',
    [quantity, cartId, productId]
  );
  return res.affectedRows > 0;
}

export async function removeCartItem(userId, productId) {
  const cartId = await ensureCart(userId);
  const [res] = await pool.query('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);
  return res.affectedRows > 0;
}

export async function clearCart(userId) {
  const cartId = await ensureCart(userId);
  await pool.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
  return true;
}
