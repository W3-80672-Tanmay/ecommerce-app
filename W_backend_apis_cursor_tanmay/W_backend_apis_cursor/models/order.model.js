import pool from '../config/db.js';

export async function createOrderFromCart(userId, addressId, paymentMethod = 'COD') {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [[cart]] = await conn.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    if (!cart) throw new Error('Cart not found');

    const [items] = await conn.query(
      `SELECT ci.product_id, ci.quantity, p.name, p.price, p.stock_quantity
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.cart_id = ?`,
      [cart.id]
    );
    if (!items.length) throw new Error('Cart is empty');

    // validate stock
    for (const it of items) {
      if (it.stock_quantity < it.quantity) {
        throw Object.assign(new Error(`Insufficient stock for product ${it.name}`), { status: 400 });
      }
    }

    const subtotal = items.reduce((s, it) => s + Number(it.price) * it.quantity, 0);
    const shipping = 0;
    const total = subtotal + shipping;

    const [orderRes] = await conn.query(
      `INSERT INTO orders (user_id, address_id, payment_method, status, subtotal_amount, shipping_amount, total_amount)
       VALUES (?, ?, 'COD', 'PENDING', ?, ?, ?)`,
      [userId, addressId, subtotal, shipping, total]
    );
    const orderId = orderRes.insertId;

    for (const it of items) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, it.product_id, it.name, it.price, it.quantity, Number(it.price) * it.quantity]
      );
      await conn.query(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [it.quantity, it.product_id]
      );
    }

    await conn.query('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);

    await conn.commit();
    return orderId;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export async function listOrders(userId) {
  const [rows] = await pool.query(
    `SELECT id, user_id, address_id, payment_method, status, subtotal_amount, shipping_amount, total_amount, created_at
     FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

export async function getOrderById(userId, orderId) {
  const [[order]] = await pool.query(
    `SELECT id, user_id, address_id, payment_method, status, subtotal_amount, shipping_amount, total_amount, created_at
     FROM orders WHERE id = ? AND user_id = ?`,
    [orderId, userId]
  );
  if (!order) return null;
  const [items] = await pool.query(
    `SELECT product_id, product_name, unit_price, quantity, total_price
     FROM order_items WHERE order_id = ?`,
    [orderId]
  );
  order.items = items;
  return order;
}

export async function adminListOrders({ status, page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;
  const where = [];
  const params = [];
  if (status) {
    where.push('status = ?');
    params.push(status);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const countSql = `SELECT COUNT(*) as total FROM orders ${whereSql}`;
  const [c] = await pool.query(countSql, params);
  const total = c[0]?.total || 0;

  params.push(Number(limit), Number(offset));
  const [rows] = await pool.query(
    `SELECT id, user_id, address_id, payment_method, status, subtotal_amount, shipping_amount, total_amount, created_at
     FROM orders ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    params
  );
  return { total, items: rows, page, limit };
}

export async function updateOrderStatus(orderId, status) {
  const [res] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
  return res.affectedRows > 0;
}
