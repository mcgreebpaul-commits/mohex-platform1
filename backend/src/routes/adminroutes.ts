// backend/src/routes/adminroutes.ts

const express = require('express');
const { Router } = require('express');
import type { Request, Response } from 'express';
const { settleTrade, getPendingTrades, getUsers, fundUserAccount, getPendingDeposits, processDeposit } = require('../controllers/admincontrollers');
const { authMiddleware } = require('../middleware/authmiddleware');
const { isAdmin } = require('../middleware/adminmiddleware');

const router = Router();

// All admin routes are protected by auth and admin middleware
router.use(authMiddleware);
router.use(isAdmin);

// User Management
router.get('/users', getUsers);
router.post('/users/fund', fundUserAccount);

// Trade Management
router.get('/trades/pending', getPendingTrades);
router.post('/trades/settle', settleTrade);

// Deposit Management
router.get('/deposits/pending', getPendingDeposits);
router.post('/deposits/process', processDeposit);

// Example route
router.get('/', (req: Request, res: Response) => {
  res.send('Admin API is working!');
});

module.exports = router;