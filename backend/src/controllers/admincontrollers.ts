// --- backend/src/controllers/adminController.ts ---
import type { Request, Response } from 'express';
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { io } = require('../server'); // Import io from your server to emit events
const bcrypt = require('bcryptjs');

// Utility to generate JWT
const generateToken = (id: number, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  });
};

// @desc    Authenticate admin & get token
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const [rows]: any = await db.query('SELECT * FROM users WHERE email = ? AND role = "admin"', [email]);
    const admin = rows[0];

    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin.id, admin.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during admin login' });
  }
};


// @desc    Simulate a trade outcome
// @route   POST /api/admin/simulate
// @access  Private/Admin
export const simulateTradeOutcome = async (req: Request, res: Response) => {
  const { tradeId, outcome, profitLossPercentage, duration } = req.body;

  if (!tradeId || !outcome || profitLossPercentage === undefined) {
    return res.status(400).json({ message: 'Missing required simulation parameters' });
  }

  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    // 1. Get the trade details
    const [tradeRows]: any = await connection.query('SELECT * FROM trades WHERE id = ? AND status = "pending"', [tradeId]);
    const trade = tradeRows[0];

    if (!trade) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ message: 'Pending trade not found' });
    }
    
    // 2. Calculate P&L
    const amount = parseFloat(trade.amount);
    const percentage = parseFloat(profitLossPercentage);
    let pnl = 0;
    if (outcome === 'win') {
      pnl = amount * (percentage / 100);
    } else if (outcome === 'loss') {
      pnl = - (amount * (percentage / 100));
    } else {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ message: 'Invalid outcome specified' });
    }

    const finalAmount = amount + pnl;

    // 3. Update the user's portfolio balance
    await connection.query('UPDATE portfolios SET balance = balance + ? WHERE user_id = ?', [pnl, trade.user_id]);

    // 4. Update the trade status and outcome details
    const outcomeDetails = JSON.stringify({
        outcome,
        pnl,
        finalAmount,
        profitLossPercentage,
        duration,
        simulatedAt: new Date()
    });

    await connection.query('UPDATE trades SET status = ?, outcome = ? WHERE id = ?', [outcome, outcomeDetails, tradeId]);

    await connection.commit();
    connection.release();

    // 5. Notify the user via WebSocket
    io.to(`user_${trade.user_id}`).emit('trade_update', {
        message: `Your ${trade.pair} trade has been resolved!`,
        tradeId: trade.id,
        outcome,
        pnl
    });

    res.status(200).json({ message: 'Trade simulated successfully', tradeId, outcome });

  } catch (error) {
    console.error('Trade simulation error:', error);
    res.status(500).json({ message: 'Server error during trade simulation' });
  }
};


// Placeholders for other admin functions
const getAdminDashboardStats = async (req: Request, res: Response) => { res.json({ message: 'Stats endpoint' }); };
const getPendingTrades = async (req: Request, res: Response) => { 
    try {
        const [trades]: any = await db.query(
            `SELECT t.id, t.pair, t.amount, t.signal, t.status, u.email as user_email 
             FROM trades t JOIN users u ON t.user_id = u.id 
             WHERE t.status = 'pending' ORDER BY t.created_at DESC`
        );
        res.json(trades);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch pending trades' });
    }
};
export const getUsers = async (req: Request, res: Response) => {
  try {
    const [users]: any = await db.query('SELECT id, name, email, role FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};
const fundUserAccount = async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  if (!userId || !amount) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    await db.query('UPDATE portfolios SET balance = balance + ? WHERE user_id = ?', [amount, userId]);
    res.status(200).json({ message: 'User account funded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fund user account' });
  }
};
const getPendingDeposits = async (req: Request, res: Response) => {
  try {
    const [deposits]: any = await db.query('SELECT * FROM deposits WHERE status = "pending"');
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending deposits' });
  }
};
const processDeposit = async (req: Request, res: Response) => {
  const { depositId, status } = req.body;
  if (!depositId || !status) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    await db.query('UPDATE deposits SET status = ? WHERE id = ?', [status, depositId]);
    res.status(200).json({ message: 'Deposit processed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to process deposit' });
  }
};
export const approvePayment = async (req: Request, res: Response) => { /* Logic to approve a payment */ };
export const rejectPayment = async (req: Request, res: Response) => { /* Logic to reject a payment */ };
export const updateUserAccess = async (req: Request, res: Response) => { /* Logic to update user agent access */ };
export const manualUpdateBalance = async (req: Request, res: Response) => { /* Logic to manually credit/debit user */ };
const settleTrade = (req: Request, res: Response) => {
  // Implementation
};
export const getPendingPayments = async (req: Request, res: Response) => {
  try {
    // Example implementation
    const [payments]: any = await db.query('SELECT * FROM payments WHERE status = "pending"');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending payments' });
  }
};

module.exports = {
  loginAdmin,
  simulateTradeOutcome,
  getAdminDashboardStats,
  getPendingTrades,
  getUsers,
  fundUserAccount,
  getPendingDeposits,
  processDeposit,
  approvePayment,
  rejectPayment,
  updateUserAccess,
  manualUpdateBalance,
  settleTrade,
  getPendingPayments
};