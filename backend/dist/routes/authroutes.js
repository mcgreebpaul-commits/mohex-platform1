// --- backend/src/routes/adminRoutes.ts ---
import express from 'express';
import { loginAdmin, simulateTradeOutcome, getUsers, getPendingPayments, approvePayment, rejectPayment, updateUserAccess, manualUpdateBalance, } from '../controllers/admincontrollers.js'; // Changed 'adminController' to 'admincontrollers'
import { protect, isAdmin } from '../middleware/authmiddleware.js'; // Use lowercase 'authmiddleware'
const router = express.Router();
// Public route for admin login
router.post('/login', loginAdmin);
// Protected admin routes
// NOTE: getPendingTrades is not exported from the controller; remove or re-add/export it in the controller.
// If you prefer to expose the pending trades route, export getPendingTrades from backend/src/controllers/admincontrollers.ts
router.post('/trades/simulate', protect, isAdmin, simulateTradeOutcome);
router.get('/users', protect, isAdmin, getUsers);
router.get('/payments/pending', protect, isAdmin, getPendingPayments);
router.post('/payments/approve', protect, isAdmin, approvePayment);
router.post('/payments/reject', protect, isAdmin, rejectPayment);
router.put('/users/access', protect, isAdmin, updateUserAccess);
router.post('/users/balance', protect, isAdmin, manualUpdateBalance);
export default router;
