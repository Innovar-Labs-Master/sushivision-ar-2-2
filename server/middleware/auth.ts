import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Request interface to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        role: string;
        username: string;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-please-change-in-production';

export interface AuthenticatedRequest extends Request {
  user?: {
    role: string;
    username: string;
  };
}

/**
 * Middleware to verify JWT token and set user information
 */
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string; username: string };
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Middleware to check if user has required role(s)
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

/**
 * Middleware for admin-only access
 */
export const requireAdmin = requireRole(['admin']);

/**
 * Middleware for admin or kitchen staff
 */
export const requireStaff = requireRole(['admin', 'kitchen']);

/**
 * Middleware for authenticated users (any role)
 */
export const requireAuth = authenticateToken;
