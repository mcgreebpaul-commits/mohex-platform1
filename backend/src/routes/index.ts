// backend/src/routes/index.ts

import { Router } from 'express';
import authRoutes from './authroutes.js';
import tradeRoutes from './traderoutes.js';
import adminRoutes from './adminroutes.js'; // Use the correct casing

const router = Router();

// Mount the different route handlers
router.use('/auth', authRoutes);
router.use('/user', tradeRoutes); // User-specific actions like trading
router.use('/admin', adminRoutes);

export default router;