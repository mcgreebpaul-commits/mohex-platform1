// backend/src/config/db.ts

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool to the database
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

// Test the connection
pool.getConnection()
  .then((connection) => {
    console.log('✅ Database connected successfully!');
    connection.release();
  })
  .catch((err: Error) => {
    console.error('❌ Database connection failed:', err.message);
  });

export default pool;

