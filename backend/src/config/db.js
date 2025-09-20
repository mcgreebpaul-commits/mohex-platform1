"use strict";
// backend/src/config/db.js
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

// Create a connection pool to the PostgreSQL database using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test the connection
pool.connect()
  .then((client) => {
    console.log('✅ Database connected successfully!');
    client.release();
  })
  .catch((err) => {
    if (err instanceof Error) {
      console.error('❌ Database connection failed:', err.message);
    } else {
      console.error('❌ Database connection failed:', String(err));
    }
  });

module.exports = {
  pool,
  getConnection: async () => {
    return pool.connect();
  },
  execute: (text, params) => {
    return pool.query(text, params);
  }
};
