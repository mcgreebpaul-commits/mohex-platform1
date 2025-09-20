"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitDepositRequest = exports.getTradeHistory = exports.submitTrade = exports.getPortfolio = void 0;
const db = __importStar(require("../config/db"));
const logger_1 = __importDefault(require("../utils/logger"));
const socketservice_1 = require("../services/socketservice");
// ---- Get User's Portfolio ----
const getPortfolio = async (req, res) => {
    const userId = req.user?.id;
    try {
        const [portfolios] = await db.execute('SELECT * FROM portfolios WHERE user_id = ?', [userId]);
        if (portfolios.length === 0) {
            return res.status(404).json({ message: 'Portfolio not found.' });
        }
        // return the single portfolio object for the user
        return res.status(200).json(portfolios[0]);
    }
    catch (error) {
        logger_1.default.error(`Error fetching portfolio for user ${userId}:`, error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
exports.getPortfolio = getPortfolio;
// ---- Submit a Paper Trade ----
const submitTrade = async (req, res) => {
    const userId = req.user?.id;
    const { trading_pair, signal, amount } = req.body;
    if (!trading_pair || !signal || !amount || amount <= 0) {
        return res.status(400).json({ message: 'Valid trading pair, signal (buy/sell), and amount are required.' });
    }
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        // 1. Check user balance
        const [portfolios] = await connection.execute('SELECT balance FROM portfolios WHERE user_id = ? FOR UPDATE', [userId]);
        if (portfolios.length === 0 || portfolios[0].balance < amount) {
            await connection.rollback();
            return res.status(400).json({ message: 'Insufficient funds.' });
        }
        // 2. Deduct amount from balance (This amount is "staked" in the trade)
        const newBalance = portfolios[0].balance - amount;
        await connection.execute('UPDATE portfolios SET balance = ? WHERE user_id = ?', [newBalance, userId]);
        // 3. Create the trade record
        const [result] = await connection.execute('INSERT INTO trades (user_id, trading_pair, signal, amount, status) VALUES (?, ?, ?, ?, ?)', [userId, trading_pair, signal, amount, 'pending']);
        await connection.commit();
        const newTradeId = result.insertId;
        logger_1.default.info(`User ${userId} submitted a new trade #${newTradeId} for ${amount} on ${trading_pair}`);
        // Optional: Notify admin dashboard in real-time
        socketservice_1.socketService.emitToUser(0, 'new-pending-trade', { tradeId: newTradeId, userId }); // Assuming 0 is a generic admin channel
        res.status(201).json({ message: 'Trade submitted successfully.', tradeId: newTradeId });
    }
    catch (error) {
        await connection.rollback();
        logger_1.default.error(`Error submitting trade for user ${userId}:`, error);
        res.status(500).json({ message: 'Internal server error.' });
    }
    finally {
        connection.release();
    }
};
exports.submitTrade = submitTrade;
// ---- Get User's Trade History ----
const getTradeHistory = async (req, res) => {
    const userId = req.user?.id;
    try {
        const [trades] = await db.execute('SELECT * FROM trades WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json(trades);
    }
    catch (error) {
        logger_1.default.error(`Error fetching trade history for user ${userId}:`, error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
exports.getTradeHistory = getTradeHistory;
// ---- Submit a Deposit Request ----
const submitDepositRequest = async (req, res) => {
    const userId = req.user?.id;
    const { amount_usd, crypto_symbol, tx_hash } = req.body;
    if (!amount_usd || !crypto_symbol || !tx_hash) {
        return res.status(400).json({ message: 'Amount, crypto symbol, and transaction hash are required.' });
    }
    try {
        await db.execute(`INSERT INTO payments (user_id, type, status, amount_usd, crypto_symbol, tx_hash) VALUES (?, 'deposit', 'pending', ?, ?, ?)`, [userId, amount_usd, crypto_symbol, tx_hash]);
        logger_1.default.info(`User ${userId} submitted a deposit request with tx_hash: ${tx_hash}`);
        res.status(201).json({ message: 'Deposit request submitted successfully. Awaiting admin approval.' });
    }
    catch (error) {
        logger_1.default.error(`Error submitting deposit for user ${userId}:`, error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
exports.submitDepositRequest = submitDepositRequest;
