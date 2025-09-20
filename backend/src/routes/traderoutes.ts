// backend/src/routes/traderoutes.ts

import { Router } from 'express';
import { getPortfolio, submitTrade, getTradeHistory, submitDepositRequest } from '../controllers/tradecontrollers.js';
import { authMiddleware } from '../middleware/authmiddleware.js';

const router = Router();

// All routes in this file require the user to be authenticated
router.use(authMiddleware);

// Portfolio routes
router.get('/portfolio', getPortfolio);
router.post('/deposit', submitDepositRequest);

// Trading routes
router.post('/trade/submit', submitTrade);
router.get('/trade/history', getTradeHistory);

export default router;