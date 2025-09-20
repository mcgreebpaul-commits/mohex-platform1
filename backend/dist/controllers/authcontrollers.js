import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import logger from '../utils/logger.js';
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-is-long';
// ---- User Registration (Signup) ----
export const signup = async (req, res) => {
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
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
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
        logger.info(`New user registered: ${email} (ID: ${newUserId})`);
        res.status(201).json({ message: 'User registered successfully. Please log in.' });
    }
    catch (error) {
        await connection.rollback(); // Rollback on error
        logger.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error during registration.' });
    }
    finally {
        connection.release();
    }
};
// ---- User Login ----
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    try {
        // Find the user by email
        const [users] = await db.query('SELECT id, email, password_hash, role FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const user = users[0];
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password_hash);
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
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
        logger.info(`User logged in: ${email}`);
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    }
    catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
