import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import prisma from '../models/prisma.js';

export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.error('No token provided.');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    req.user = decoded;

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

// export const verifyOwnership = (resourceType) => async (req, res, next) => {
//   const resourceId = req.params.id || req.body?.id;
  
//   if (!resourceId) {
//     return res.status(400).json({ message: `${resourceType} id belirtilmedi.` });
//   }

//   const tokenUserId = req.user.userId;
//   try {
//     let resource;
    
//     switch (resourceType) {
//       case 'reportSettings':
//         resource = await prisma.reportSettings.findUnique({
//           where: { id: parseInt(resourceId) },
//         });
//         break;
//       case 'report':
//         resource = await prisma.report.findUnique({
//           where: { id: parseInt(resourceId) },
//         });
//         break;
//       // Diğer kaynak türleri için de case'ler eklenebilir
//       default:
//         return res.status(400).json({ message: 'Geçersiz kaynak türü.' });
//     }

//     if (!resource || resource.userId !== tokenUserId) {
//       return res.status(403).json({ message: `Bu ${resourceType} kaynağına erişim izniniz yok.` });
//     }

//     req[resourceType] = resource; // Controller'da kullanılacak
//     next();
//   } catch (error) {
//     console.error('Ownership error:', error);
//     return res.status(500).json({ message: 'Erişim kontrolü sırasında bir hata oluştu.' });
//   }
// };



