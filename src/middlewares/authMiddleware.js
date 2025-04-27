import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.error('No token provided.');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    // Kullanıcı bilgileri doğrulandıktan sonra req.user’a ekleniyor
    req.user = decoded;

    // Token’ın geçerliliğini kontrol et
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Invalid user data in token.' });
    }

    console.log('Token successfully verified:', decoded);

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      console.error('JWT Error: Invalid token format or signature.');
      return res.status(400).json({ message: 'Invalid token format or signature.' });
    }

    if (error.name === 'TokenExpiredError') {
      console.error('JWT Error: Token expired.');
      return res.status(401).json({ message: 'Token has expired. Please login again.' });
    }

    console.error('JWT Error:', error.message);
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

export default authMiddleware;
