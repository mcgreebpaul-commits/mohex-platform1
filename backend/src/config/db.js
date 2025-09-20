"use strict";
// backend/src/config/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = getConnection;
exports.execute = execute;
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
    .then((connection) => {
    console.log('✅ Database connected successfully!');
    connection.release();
})
    .catch((err) => {
    if (err instanceof Error) {
        console.error('❌ Database connection failed:', err.message);
    }
    else {
        console.error('❌ Database connection failed:', String(err));
    }
});
module.exports = pool;
function getConnection() {
    throw new Error('Function not implemented.');
}
function execute(arg0, arg1) {
    throw new Error('Function not implemented.');
}
