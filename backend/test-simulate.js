/* Quick test script to POST a simulate action to the backend
   Usage: set env vars or edit values below and run: node test-simulate.js
*/

const fetch = require('node-fetch');

const API_BASE = process.env.API_BASE || 'http://localhost:3002/api/admin';
const TRADE_ID = process.env.TRADE_ID || '1';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || process.env.JWT || '';

async function run() {
  const url = `${API_BASE}/trades/${TRADE_ID}/simulate`;
  const body = { result: 'win', percentage: 50 };
  const headers = { 'Content-Type': 'application/json' };
  if (ADMIN_TOKEN) headers['Authorization'] = `Bearer ${ADMIN_TOKEN}`;

  try {
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    const json = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', json);
  } catch (err) {
    console.error('Request failed:', err);
  }
}

run();
