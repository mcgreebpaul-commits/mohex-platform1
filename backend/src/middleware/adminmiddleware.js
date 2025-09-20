"use strict";
// backend/src/middleware/adminmiddleware.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDeposit = exports.getPendingDeposits = exports.fundUserAccount = exports.getUsers = exports.getPendingTrades = exports.settleTrade = exports.isAdmin = void 0;
/**
 * Middleware to verify if the user has an 'admin' role.
 * This should be used AFTER the general authmiddleware.
 */
const isAdmin = (req, res, next) => {
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
exports.isAdmin = isAdmin;
const settleTrade = (req, res) => {
    // Implementation
};
exports.settleTrade = settleTrade;
const getPendingTrades = (req, res) => {
    // Implementation
};
exports.getPendingTrades = getPendingTrades;
const getUsers = (req, res) => {
    // Implementation
};
exports.getUsers = getUsers;
const fundUserAccount = (req, res) => {
    // Implementation
};
exports.fundUserAccount = fundUserAccount;
const getPendingDeposits = (req, res) => {
    // Implementation
};
exports.getPendingDeposits = getPendingDeposits;
const processDeposit = (req, res) => {
    // Implementation
};
exports.processDeposit = processDeposit;
