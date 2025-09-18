// backend/src/middleware/adminmiddleware.ts

import { Request, Response, NextFunction } from 'express';

// Extend the Express Request interface to include the user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: string; // Change from number to string
    role: string;
  };
}

/**
 * Middleware to verify if the user has an 'admin' role.
 * This should be used AFTER the general authmiddleware.
 */
export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // The user object should have been attached by the preceding authmiddleware
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication error: User not found.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Access denied. Requires admin privileges.' });
  }

  // If user is an admin, proceed to the next middleware/controller
  next();
};

export const settleTrade = (req: Request, res: Response) => {
  // Implementation
};

export const getPendingTrades = (req: Request, res: Response) => {
  // Implementation
};

export const getUsers = (req: Request, res: Response) => {
  // Implementation
};

export const fundUserAccount = (req: Request, res: Response) => {
  // Implementation
};

export const getPendingDeposits = (req: Request, res: Response) => {
  // Implementation
};

export const processDeposit = (req: Request, res: Response) => {
  // Implementation
};