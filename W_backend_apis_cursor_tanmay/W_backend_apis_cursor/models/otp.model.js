import pool from '../config/db.js';

export async function createOtp(phone, code, expiresAt) {
  const [result] = await pool.query(
    'INSERT INTO otp_verifications (phone, otp_code, expires_at) VALUES (?, ?, ?)',
    [phone, code, expiresAt]
  );
  return result.insertId;
}

export async function verifyOtp(phone, code) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query(
      'SELECT id, expires_at, is_used FROM otp_verifications WHERE phone = ? AND otp_code = ? ORDER BY id DESC LIMIT 1',
      [phone, code]
    );
    if (!rows.length) {
      await conn.commit();
      return { valid: false, reason: 'invalid' };
    }
    const otp = rows[0];
    if (otp.is_used) {
      await conn.commit();
      return { valid: false, reason: 'used' };
    }
    if (new Date(otp.expires_at) < new Date()) {
      await conn.commit();
      return { valid: false, reason: 'expired' };
    }
    await conn.query('UPDATE otp_verifications SET is_used = 1, used_at = NOW() WHERE id = ?', [otp.id]);
    await conn.commit();
    return { valid: true };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}
