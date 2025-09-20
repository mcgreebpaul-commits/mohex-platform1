// backend/src/config/db.ts

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test the connection
pool.connect()
  .then((client: any) => {
    console.log('✅ Database connected successfully!');
    client.release();
  })
  .catch((err: Error) => {
    console.error('❌ Database connection failed:', err.message);
  });

export default pool;

