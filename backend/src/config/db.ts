// backend/src/config/index.ts

import type { PoolConnection } from 'mysql2/promise';
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create a connection pool to the database
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Doggy234.',
  database: process.env.DB_NAME || 'mohex',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
pool.getConnection()
  .then((connection: PoolConnection) => {
    console.log('✅ Database connected successfully!');
    connection.release();
  })
  .catch((err: unknown) => {
    if (err instanceof Error) {
      console.error('❌ Database connection failed:', err.message);
    } else {
      console.error('❌ Database connection failed:', String(err));
    }
  });

module.exports = pool;

export function getConnection() {
  throw new Error('Function not implemented.');
}
export function execute(arg0: string, arg1: any[]): any {
  throw new Error('Function not implemented.');
}

