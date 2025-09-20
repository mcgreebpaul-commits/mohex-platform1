"use strict";
// backend/src/routes/adminroutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admincontrollers_1 = require("../controllers/admincontrollers");
const authmiddleware_1 = require("../middleware/authmiddleware");
const adminmiddleware_1 = require("../middleware/adminmiddleware");
const router = (0, express_1.Router)();
// All admin routes are protected by auth and admin middleware
router.use(authmiddleware_1.authMiddleware);
router.use(adminmiddleware_1.isAdmin);
// User Management
router.get('/users', admincontrollers_1.getUsers);
router.post('/users/fund', admincontrollers_1.fundUserAccount);
// Trade Management
router.get('/trades/pending', admincontrollers_1.getPendingTrades);
router.post('/trades/settle', admincontrollers_1.settleTrade);
// Deposit Management
router.get('/deposits/pending', admincontrollers_1.getPendingDeposits);
router.post('/deposits/process', admincontrollers_1.processDeposit);
// Example route
router.get('/', (req, res) => {
    res.send('Admin API is working!');
});
exports.default = router;
