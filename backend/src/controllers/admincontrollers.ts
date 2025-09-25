import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import type { Request, Response } from 'express';
import { socketService } from '../services/socketservice.js';

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
    const result = await db.query('SELECT * FROM users WHERE email = $1 AND role = $2', [email, 'admin']);
    const rows = (result && (result as any).rows) || [];
    const admin = rows[0];

    if (admin && (await bcrypt.compare(password, admin.password))) {
      return res.json({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin.id, admin.role),
      });
    }

    return res.status(401).json({ message: 'Invalid admin credentials' });
  } catch (error) {
    console.error('loginAdmin error:', error);
    return res.status(500).json({ message: 'Server error during admin login' });
  }
};


// @desc    Simulate a trade outcome
// @route   POST /api/admin/simulate
// @access  Private/Admin
export const simulateTradeOutcome = async (req: Request, res: Response) => {
  const { tradeId, outcome, percentage } = req.body;
  if (!tradeId || !outcome) {
    return res.status(400).json({ success: false, message: 'tradeId and outcome are required' });
  }

  const pct = typeof percentage === 'number' ? percentage : Number(percentage) || 100;

  // Acquire a client from the pool
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Lock the trade row
    const tradeRes = await client.query('SELECT * FROM trades WHERE id = $1 FOR UPDATE', [tradeId]);
    if (tradeRes.rowCount === 0) {
      await client.query('ROLLBACK');
      client.release();
      return res.status(404).json({ success: false, message: 'Trade not found' });
    }

    const trade = tradeRes.rows[0];
    if (trade.status !== 'pending') {
      await client.query('ROLLBACK');
      client.release();
      return res.status(400).json({ success: false, message: 'Only pending trades can be settled' });
    }

    const positionSize = Number(trade.amount) || 0;
    const pnl = outcome === 'win' ? positionSize * (pct / 100) : -positionSize * (pct / 100);

    // Update trade
    await client.query('UPDATE trades SET status = $1, outcome = $2, percentage = $3, pnl = $4, settled_at = now() WHERE id = $5',
      ['settled', outcome, pct, pnl, tradeId]
    );

    // Update user's balance - assume users table has balance
    if (trade.user_id) {
      await client.query('UPDATE users SET balance = COALESCE(balance,0) + $1 WHERE id = $2', [pnl, trade.user_id]);
    }

    // Audit log (non-fatal)
    try {
      const adminId = (req as any).body?.adminId || null;
      await client.query('INSERT INTO admin_audit (admin_id, action, entity_type, entity_id, details, created_at) VALUES ($1,$2,$3,$4,$5,now())',
        [adminId, 'simulate_trade', 'trade', tradeId, JSON.stringify({ outcome, percentage: pct, pnl })]
      );
    } catch (auditErr: any) {
      console.warn('Audit insert failed (non-fatal):', (auditErr && auditErr.message) || auditErr);
    }

    await client.query('COMMIT');
    client.release();

    // Emit socket event
    try {
      socketService.emitToUser(trade.user_id, 'tradeUpdate', { tradeId, outcome, percentage: pct, pnl });
    } catch (emitErr: any) {
      console.warn('Socket emit failed (non-fatal):', (emitErr && emitErr.message) || emitErr);
    }

    return res.json({ success: true, tradeId, outcome, percentage: pct, pnl });
  } catch (err) {
    await client.query('ROLLBACK');
    client.release();
    console.error('simulateTradeOutcome error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error', error: String(err) });
  }
};


// Placeholders for other admin functions
const getAdminDashboardStats = async (req: Request, res: Response) => { res.json({ message: 'Stats endpoint' }); };
export const getPendingTrades = async (req: Request, res: Response) => { 
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
export const fundUserAccount = async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  if (!userId || !amount) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    await db.query('UPDATE portfolios SET balance = balance + $1 WHERE user_id = $2', [amount, userId]);
    res.status(200).json({ message: 'User account funded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fund user account' });
  }
};
export const getPendingDeposits = async (req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM deposits WHERE status = $1', ['pending']);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending deposits' });
  }
};
export const processDeposit = async (req: Request, res: Response) => {
  const { depositId, status } = req.body;
  if (!depositId || !status) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    await db.query('UPDATE deposits SET status = $1 WHERE id = $2', [status, depositId]);
    res.status(200).json({ message: 'Deposit processed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to process deposit' });
  }
};
export const approvePayment = async (req: Request, res: Response) => { /* Logic to approve a payment */ };
export const rejectPayment = async (req: Request, res: Response) => { /* Logic to reject a payment */ };
export const updateUserAccess = async (req: Request, res: Response) => { /* Logic to update user agent access */ };
export const manualUpdateBalance = async (req: Request, res: Response) => { /* Logic to manually credit/debit user */ };
export const settleTrade = (req: Request, res: Response) => {
  // Implementation
};
export const getPendingPayments = async (req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM payments WHERE status = $1', ['pending']);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending payments' });
  }
};