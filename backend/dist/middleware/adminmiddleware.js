// backend/src/middleware/adminmiddleware.ts
/**
 * Middleware to verify if the user has an 'admin' role.
 * This should be used AFTER the general authmiddleware.
 */
export const isAdmin = (req, res, next) => {
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
export const settleTrade = (req, res) => {
    // Implementation
};
export const getPendingTrades = (req, res) => {
    // Implementation
};
export const getUsers = (req, res) => {
    // Implementation
};
export const fundUserAccount = (req, res) => {
    // Implementation
};
export const getPendingDeposits = (req, res) => {
    // Implementation
};
export const processDeposit = (req, res) => {
    // Implementation
};
