import dotenv from 'dotenv';

dotenv.config(); // Load from .env file

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET_KEY,
  dbUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
  emailUser:process.env.EMAIL_USER,
  emailPass:process.env.EMAIL_PASSWORD
};
