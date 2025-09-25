Integration test: simulate trade flow

This file contains quick manual test instructions and small scripts to exercise the admin simulate flow and observe socket events.

Prereqs:
- Backend running locally (e.g., PORT=3002) and reachable at http://localhost:3002
- A trade record exists in the `trades` table with status `pending` and a known id
- A user record exists with id matching trade.user_id
- Node >= 16 installed

1) Manual curl (PowerShell) test for simulate (replace TRADE_ID, ADMIN_TOKEN):

PowerShell (Windows):
```powershell
$headers = @{ Authorization = "Bearer YOUR_ADMIN_JWT" ; 'Content-Type' = 'application/json' }
$body = @{ result = 'win'; percentage = 50 } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3002/api/admin/trades/TRADE_ID/simulate" -Method Post -Headers $headers -Body $body
```

2) Quick Node script to POST simulate (replace placeholders or set env vars):

Run: node test-simulate.js

3) Socket listener to observe tradeUpdate events

Run: node socket-listen.js

Notes:
- Ensure the socket client registers the user id via the 'register' event so the server can emit to that socket.
- The server emits the event name 'tradeUpdate' with payload { tradeId, outcome, percentage, pnl }.
