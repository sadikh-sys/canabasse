import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, AuthUser } from '../types';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt';
import databaseService from '../services/database';

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) return res.status(401).json({ success: false, message: 'Access token required' });

    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ success: false, message: 'Invalid or expired token' });

    const user = await databaseService.findUserById(payload.userId);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    req.user = user as AuthUser;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ success: false, message: 'Authentication failed' });
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        const user = await databaseService.findUserById(payload.userId);
        if (user) req.user = user as AuthUser;
      }
    }
    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next();
  }
};