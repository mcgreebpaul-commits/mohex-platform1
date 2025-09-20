import db from '../config/db.js';
import logger from '../utils/logger.js';
import { socketService } from '../services/socketservice.js';
// ---- Get User's Portfolio ----
export const getPortfolio = async (req, res) => {
    const userId = req.user?.id;
    try {
        const [portfolios] = await db.query('SELECT * FROM portfolios WHERE user_id = ?', [userId]);
        if (portfolios.length === 0) {
            return res.status(404).json({ message: 'Portfolio not found.' });
        }
        // return the single portfolio object for the user
        return res.status(200).json(portfolios[0]);
    }
    catch (error) {
        logger.error(`Error fetching portfolio for user ${userId}:`, error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
// ---- Submit a Paper Trade ----
export const submitTrade = async (req, res) => {
    const userId = req.user?.id;
    const { trading_pair, signal, amount } = req.body;
    if (!trading_pair || !signal || !amount || amount <= 0) {
        return res.status(400).json({ message: 'Valid trading pair, signal (buy/sell), and amount are required.' });
    }
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        // 1. Check user balance
        const [portfolios] = await connection.query('SELECT balance FROM portfolios WHERE user_id = ? FOR UPDATE', [userId]);
        if (portfolios.length === 0 || portfolios[0].balance < amount) {
            await connection.rollback();
            return res.status(400).json({ message: 'Insufficient funds.' });
        }
        // 2. Deduct amount from balance (This amount is "staked" in the trade)
        const newBalance = portfolios[0].balance - amount;
        await connection.query('UPDATE portfolios SET balance = ? WHERE user_id = ?', [newBalance, userId]);
        // 3. Create the trade record
        const [result] = await connection.query('INSERT INTO trades (user_id, trading_pair, signal, amount, status) VALUES (?, ?, ?, ?, ?)', [userId, trading_pair, signal, amount, 'pending']);
        await connection.commit();
        const newTradeId = result.insertId;
        logger.info(`User ${userId} submitted a new trade #${newTradeId} for ${amount} on ${trading_pair}`);
        // Optional: Notify admin dashboard in real-time
        socketService.emitToUser(0, 'new-pending-trade', { tradeId: newTradeId, userId }); // Assuming 0 is a generic admin channel
        res.status(201).json({ message: 'Trade submitted successfully.', tradeId: newTradeId });
    }
    catch (error) {
        await connection.rollback();
        logger.error(`Error submitting trade for user ${userId}:`, error);
        res.status(500).json({ message: 'Internal server error.' });
    }
    finally {
        connection.release();
    }
};
// ---- Get User's Trade History ----
export const getTradeHistory = async (req, res) => {
    const userId = req.user?.id;
    try {
        const [trades] = await db.query('SELECT * FROM trades WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json(trades);
    }
    catch (error) {
        logger.error(`Error fetching trade history for user ${userId}:`, error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
// ---- Submit a Deposit Request ----
export const submitDepositRequest = async (req, res) => {
    const userId = req.user?.id;
    const { amount_usd, crypto_symbol, tx_hash } = req.body;
    if (!amount_usd || !crypto_symbol || !tx_hash) {
        return res.status(400).json({ message: 'Amount, crypto symbol, and transaction hash are required.' });
    }
    try {
        await db.query(`INSERT INTO payments (user_id, type, status, amount_usd, crypto_symbol, tx_hash) VALUES (?, 'deposit', 'pending', ?, ?, ?)`, [userId, amount_usd, crypto_symbol, tx_hash]);
        logger.info(`User ${userId} submitted a deposit request with tx_hash: ${tx_hash}`);
        res.status(201).json({ message: 'Deposit request submitted successfully. Awaiting admin approval.' });
    }
    catch (error) {
        logger.error(`Error submitting deposit for user ${userId}:`, error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
