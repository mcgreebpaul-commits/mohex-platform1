"use strict";
// backend/src/controllers/authcontrollers.ts
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
exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db = __importStar(require("../config/db"));
const logger_1 = __importDefault(require("../utils/logger"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-is-long';
// ---- User Registration (Signup) ----
const signup = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    const connection = await db.getConnection();
    try {
        // Check if user already exists
        const [existingUsers] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }
        // Hash the password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Start a transaction to ensure all or nothing
        await connection.beginTransaction();
        // Insert new user
        const [result] = await connection.execute('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)', [email, hashedPassword, 'user']);
        const newUserId = result.insertId;
        // Initialize portfolio for the new user
        await connection.execute('INSERT INTO portfolios (user_id, balance) VALUES (?, ?)', [newUserId, 0.00]);
        // Grant free plan on signup (assuming plan_id 1 is 'Free')
        await connection.execute(`INSERT INTO subscriptions (user_id, plan_id, status, expires_at) VALUES (?, ?, 'active', DATE_ADD(NOW(), INTERVAL 1 YEAR))`, [newUserId, 1]);
        await connection.commit(); // Commit the transaction
        logger_1.default.info(`New user registered: ${email} (ID: ${newUserId})`);
        res.status(201).json({ message: 'User registered successfully. Please log in.' });
    }
    catch (error) {
        await connection.rollback(); // Rollback on error
        logger_1.default.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error during registration.' });
    }
    finally {
        connection.release();
    }
};
exports.signup = signup;
// ---- User Login ----
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    try {
        // Find the user by email
        const [users] = await db.execute('SELECT id, email, password_hash, role FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const user = users[0];
        // Compare passwords
        const isMatch = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };
        // Sign the token
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '7d' });
        logger_1.default.info(`User logged in: ${email}`);
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    }
    catch (error) {
        logger_1.default.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
exports.login = login;
