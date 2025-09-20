// backend/src/config/index.ts

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

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
  .then((connection) => {
    console.log('✅ Database connected successfully!');
    connection.release();
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
  });

export default pool;

