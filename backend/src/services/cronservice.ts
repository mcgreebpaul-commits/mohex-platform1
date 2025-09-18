// backend/src/services/cronservice.ts

import cron from 'node-cron';
import * as db from '../config/db'; // Import the database pool
import logger from '../utils/logger';

export const startSubscriptionCronJob = () => {
  // Schedule a task to run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    logger.info('Running daily cron job: Checking for expired subscriptions...');

    try {
      // cast to any so TypeScript recognizes the connection methods like execute/release
      const connection: any = await db.getConnection();

      // Find subscriptions that are past their expiration date and still active
      const [expiredSubscriptions]: any = await connection.execute(
        `SELECT id FROM subscriptions WHERE expires_at < NOW() AND status = 'active'`
      );

      if (expiredSubscriptions.length === 0) {
        logger.info('No expired subscriptions found.');
        // use optional chaining in case connection is undefined/null
        connection?.release?.();
        return;
      }

      const subscriptionIds = expiredSubscriptions.map((sub: { id: number }) => sub.id);

      // Update the status of expired subscriptions to 'expired'
      const [updateResult]: any = await connection.execute(
        `UPDATE subscriptions SET status = 'expired' WHERE id IN (?)`,
        [subscriptionIds]
      );

      logger.info(`Successfully updated ${updateResult.affectedRows} subscriptions to 'expired'.`);
      connection?.release?.();

    } catch (error) {
      if (error instanceof Error) {
        logger.error('Error during subscription cron job:', error.message);
      } else {
        logger.error('An unknown error occurred during the subscription cron job.');
      }
    }
  });

  console.log('✅ Cron job for subscriptions has been scheduled.');
};