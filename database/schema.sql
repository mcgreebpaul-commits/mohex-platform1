CREATE DATABASE IF NOT EXISTS mohex;
USE mohex;

-- Users Table: Stores user credentials and roles
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Subscription Plans Table: Defines available subscription tiers
CREATE TABLE IF NOT EXISTS `subscription_plans` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price_usd` DECIMAL(10, 2) NOT NULL,
  `agents_included` JSON NOT NULL, -- e.g., '["TRADE IDEA COPILOT", "Market Analyst assistant"]'
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Subscriptions Table: Links users to their active/expired plans
CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `plan_id` INT NOT NULL,
  `status` ENUM('active', 'expired', 'cancelled') NOT NULL DEFAULT 'active',
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans`(`id`)
) ENGINE=InnoDB;

-- Portfolios Table: Manages users' simulated trading balances
CREATE TABLE IF NOT EXISTS `portfolios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `balance_usd` DECIMAL(20, 8) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Cryptos Table: Stores admin-configured cryptocurrencies for payments
CREATE TABLE IF NOT EXISTS `cryptos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `symbol` VARCHAR(50) NOT NULL,
  `wallet_address` VARCHAR(255) NOT NULL,
  `qr_code_url` VARCHAR(255),
  `is_active` BOOLEAN NOT NULL DEFAULT true
) ENGINE=InnoDB;

-- Payments Table: Tracks all subscription and deposit transactions
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `crypto_id` INT,
  `amount_usd` DECIMAL(20, 8) NOT NULL,
  `amount_crypto` DECIMAL(20, 8),
  `tx_hash` VARCHAR(255) UNIQUE,
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `type` ENUM('subscription', 'deposit') NOT NULL,
  `subscription_plan_id` INT, -- Link to plan if type is 'subscription'
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`crypto_id`) REFERENCES `cryptos`(`id`)
) ENGINE=InnoDB;

-- Trades Table: Logs all simulated trading activities
CREATE TABLE IF NOT EXISTS `trades` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `pair` VARCHAR(50) NOT NULL, -- e.g., 'BTC/USD'
  `signal` ENUM('buy', 'sell') NOT NULL,
  `amount_usd` DECIMAL(20, 8) NOT NULL,
  `status` ENUM('pending', 'closed') NOT NULL DEFAULT 'pending',
  `outcome` ENUM('win', 'loss'),
  `outcome_details` JSON, -- Stores admin parameters like P/L%, duration, etc.
  `pnl_usd` DECIMAL(20, 8), -- Profit and Loss
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `closed_at` TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Chat History Table: Stores conversation transcripts with AI agents
CREATE TABLE IF NOT EXISTS `chat_history` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `agent_name` VARCHAR(255) NOT NULL,
    `messages` JSON NOT NULL, -- Stores an array of message objects
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Admin Logs Table: Audits all critical actions performed by admins
CREATE TABLE IF NOT EXISTS `admin_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `admin_id` INT NOT NULL,
    `action` VARCHAR(255) NOT NULL,
    `target_user_id` INT,
    `details` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB;

-- Default Data Inserts (Example)
INSERT INTO `subscription_plans` (`name`, `description`, `price_usd`, `agents_included`) VALUES
('Free', 'Access to the Trade Idea Copilot.', 0.00, '["TRADE IDEA COPILOT"]'),
('Pro', 'Access to 3 powerful AI agents.', 20.00, '["TRADE IDEA COPILOT", "Market Analyst assistant", "Portfolio Builder assistant"]'),
('Premium', 'Unlock all 5 AI agents for maximum trading insight.', 50.00, '["TRADE IDEA COPILOT", "Market Analyst assistant", "Portfolio Builder assistant", "Trendspotter Assistant", "Risk Manager Assistant"]');

INSERT INTO `cryptos` (`name`, `symbol`, `wallet_address`) VALUES
('Bitcoin', 'BTC', 'YOUR_BITCOIN_WALLET_ADDRESS_HERE'),
('Ethereum', 'ETH', 'YOUR_ETHEREUM_WALLET_ADDRESS_HERE');