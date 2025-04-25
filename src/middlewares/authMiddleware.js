import jwt from 'jsonwebtoken';
import { config } from './config/config.js';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

export default authMiddleware;
