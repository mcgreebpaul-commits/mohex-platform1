// backend/src/routes/adminroutes.ts
import { Router } from 'express';
import { settleTrade, getPendingTrades, getUsers, fundUserAccount, getPendingDeposits, processDeposit, simulateTradeOutcome } from '../controllers/admincontrollers.js';
import { authMiddleware } from '../middleware/authmiddleware.js';
import { isAdmin } from '../middleware/adminmiddleware.js';
import { getTradeById } from '../controllers/admincontrollers.js';
const router = Router();
// All admin routes are protected by auth and admin middleware
router.use(authMiddleware);
router.use(isAdmin);
// User Management
router.get('/users', getUsers);
router.post('/users/fund', fundUserAccount);
// Trade Management
router.get('/trades/pending', getPendingTrades);
// Simulate a specific trade outcome (also keep settle endpoint)
router.get('/trades/:id', getTradeById);
router.post('/trades/:id/simulate', simulateTradeOutcome);
router.post('/trades/settle', settleTrade);
// Deposit Management
router.get('/deposits/pending', getPendingDeposits);
router.post('/deposits/process', processDeposit);
// Example route
router.get('/', (req, res) => {
    res.send('Admin API is working!');
});
export default router;
