"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// --- backend/src/routes/adminRoutes.ts ---
const express_1 = __importDefault(require("express"));
const admincontrollers_1 = require("../controllers/admincontrollers"); // Changed 'adminController' to 'admincontrollers'
const authmiddleware_1 = require("../middleware/authmiddleware"); // Use lowercase 'authmiddleware'
const router = express_1.default.Router();
// Public route for admin login
router.post('/login', admincontrollers_1.loginAdmin);
// Protected admin routes
// NOTE: getPendingTrades is not exported from the controller; remove or re-add/export it in the controller.
// If you prefer to expose the pending trades route, export getPendingTrades from backend/src/controllers/admincontrollers.ts
router.post('/trades/simulate', authmiddleware_1.protect, authmiddleware_1.isAdmin, admincontrollers_1.simulateTradeOutcome);
router.get('/users', authmiddleware_1.protect, authmiddleware_1.isAdmin, admincontrollers_1.getUsers);
router.get('/payments/pending', authmiddleware_1.protect, authmiddleware_1.isAdmin, admincontrollers_1.getPendingPayments);
router.post('/payments/approve', authmiddleware_1.protect, authmiddleware_1.isAdmin, admincontrollers_1.approvePayment);
router.post('/payments/reject', authmiddleware_1.protect, authmiddleware_1.isAdmin, admincontrollers_1.rejectPayment);
router.put('/users/access', authmiddleware_1.protect, authmiddleware_1.isAdmin, admincontrollers_1.updateUserAccess);
router.post('/users/balance', authmiddleware_1.protect, authmiddleware_1.isAdmin, admincontrollers_1.manualUpdateBalance);
exports.default = router;
