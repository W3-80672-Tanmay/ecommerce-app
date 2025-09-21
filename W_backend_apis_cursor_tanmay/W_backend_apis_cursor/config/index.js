import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'ecommerce_db'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'changeme',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  otp: {
    expiryMinutes: Number(process.env.OTP_EXPIRY_MINUTES || 10),
    allowDevOtpResponse: String(process.env.ALLOW_DEV_OTP_RESPONSE || 'false') === 'true'
  }
};
