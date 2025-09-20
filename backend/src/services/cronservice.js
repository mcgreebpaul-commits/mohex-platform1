"use strict";
// backend/src/services/cronservice.ts
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
exports.startSubscriptionCronJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const db = __importStar(require("../config/db")); // Import the database pool
const logger_1 = __importDefault(require("../utils/logger"));
const startSubscriptionCronJob = () => {
    // Schedule a task to run every day at midnight
    node_cron_1.default.schedule('0 0 * * *', async () => {
        logger_1.default.info('Running daily cron job: Checking for expired subscriptions...');
        try {
            // cast to any so TypeScript recognizes the connection methods like execute/release
            const connection = await db.getConnection();
            // Find subscriptions that are past their expiration date and still active
            const [expiredSubscriptions] = await connection.execute(`SELECT id FROM subscriptions WHERE expires_at < NOW() AND status = 'active'`);
            if (expiredSubscriptions.length === 0) {
                logger_1.default.info('No expired subscriptions found.');
                // use optional chaining in case connection is undefined/null
                connection?.release?.();
                return;
            }
            const subscriptionIds = expiredSubscriptions.map((sub) => sub.id);
            // Update the status of expired subscriptions to 'expired'
            const [updateResult] = await connection.execute(`UPDATE subscriptions SET status = 'expired' WHERE id IN (?)`, [subscriptionIds]);
            logger_1.default.info(`Successfully updated ${updateResult.affectedRows} subscriptions to 'expired'.`);
            connection?.release?.();
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error('Error during subscription cron job:', error.message);
            }
            else {
                logger_1.default.error('An unknown error occurred during the subscription cron job.');
            }
        }
    });
    console.log('✅ Cron job for subscriptions has been scheduled.');
};
exports.startSubscriptionCronJob = startSubscriptionCronJob;
