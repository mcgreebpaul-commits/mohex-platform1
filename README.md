# Mohex Platform — Developer & Deployment Guide

This repository contains the Mohex frontend (Next.js) and backend (TypeScript + Express). This guide explains running locally, building, and deploying:

- Backend: deploy to Heroku (or any Node host)
- Frontend: deploy to Netlify and configure domain mohex.org

Important files
- Backend server entry: [`backend/src/server.ts`](backend/src/server.ts:1)
- Backend package.json: [`backend/package.json`](backend/package.json:1)
- Backend tsconfig: [`backend/tsconfig.json`](backend/tsconfig.json:1)
- Backend Procfile: [`backend/procfile`](backend/procfile:1)
- Root Procfile: [`Procfile`](Procfile:1)
- Frontend package.json: [`frontend/package.json`](frontend/package.json:1)
- Frontend env example: [`frontend/.env.example`](frontend/.env.example:1)
- Netlify config (root): [`netlify.toml`](netlify.toml:1)
- Frontend Netlify plugin config: [`frontend/netlify.toml`](frontend/netlify.toml:1)

Prerequisites
- Node.js 18.x (project engines set to 18.x)
- npm (or yarn)
- Git, and accounts for Heroku and Netlify
- Access to DNS management for mohex.org

Local development

1. Install dependencies
- From root (optional helper): npm install
- Frontend: cd frontend && npm install
- Backend: cd backend && npm install

2. Run frontend (dev)
- cd frontend
- npm run dev
- Frontend dev server default port: 3001 (see [`frontend/package.json`](frontend/package.json:1)).

3. Run backend (dev)
- cd backend
- npm run dev
- Backend dev uses ts-node-dev and listens on the port defined by `PORT` env var or 3002 by default (see [`backend/src/server.ts`](backend/src/server.ts:1)).

Build and run production locally

1. Backend production build
- cd backend
- npm run build
- npm start
- The backend will serve the compiled JS from `dist/` (see [`backend/package.json`](backend/package.json:1) "main": "dist/server.js").

2. Frontend production build (Next.js)
- cd frontend
- npm run build
- npm run start (or deploy the frontend build to Netlify; Netlify uses the Next.js plugin to handle build/publish automatically)

Environment variables
- Do NOT commit secrets. Use `.env` locally and provider-specific environment settings in Heroku/Netlify.
- Example frontend variables: see [`frontend/.env.example`](frontend/.env.example:1)
- Example backend variables: store DB credentials, JWT_SECRET, and other keys in Heroku Config Vars (do not commit to repo).

Backend — Heroku deployment (recommended simple flow)
1. Create Heroku app
- heroku create <app-name> (or create via dashboard)

2. Ensure root-level build step triggers backend build
- This repository contains a root `package.json` that runs backend build during `heroku-postbuild` and a root `Procfile` to run `npm run start`. Root `Procfile` currently: [`Procfile`](Procfile:1)
- Backend `package.json` contains `engines.node = 18.x` and `heroku-postbuild` to compile TypeScript.

3. Set required Heroku config vars
- In Heroku dashboard > Settings > Config Vars, set:
  - PORT (Heroku sets this for you automatically; do not hardcode)
  - DATABASE_URL / PG_CONNECTION / MYSQL_URL (per your DB)
  - JWT_SECRET, NODE_ENV=production, and other secrets used by the app

4. Deploy
- Commit changes and push to the Heroku git remote:
  - git push heroku main
  - Heroku will run the root-level `heroku-postbuild` which will build the backend and produce `dist/`, then run the `web` process defined in Procfile.

5. Verify
- Visit https://<app-name>.herokuapp.com/ and check `GET /` and `GET /health` endpoints (see [`backend/src/server.ts`](backend/src/server.ts:1)).

Notes & troubleshooting for Heroku
- TypeScript config uses "module": "NodeNext" and "moduleResolution": "nodenext" (see [`backend/tsconfig.json`](backend/tsconfig.json:1)). This is compatible with Node 18+ when building to JS in `dist/`.
- If you see port conflicts locally, ensure no other process is listening on the same port (EADDRINUSE). Heroku assigns the PORT env variable in production.

Frontend — Netlify deployment (recommended)
1. Prepare Netlify
- In Netlify dashboard, create a new site > Import from Git repo (select this repository).
- In Build settings:
  - Base directory: frontend
  - Build command: npm run build
  - Publish directory: .netlify/output
  - Netlify will use the official Next.js plugin configured in [`netlify.toml`](netlify.toml:1) (root) and [`frontend/netlify.toml`](frontend/netlify.toml:1).

2. Environment variables (Netlify)
- In Site > Settings > Build & deploy > Environment:
  - NEXT_PUBLIC_API_BASE_URL=https://api.mohex.org (or the Heroku app URL)
  - Any other NEXT_PUBLIC_* or runtime keys required by the frontend (do NOT add secrets that are not meant to run in the browser).

3. Custom domain (mohex.org)
- In Netlify > Domain management > Add custom domain: mohex.org
- Configure DNS: point your domain's A/ALIAS or CNAME as Netlify instructs.
- Optionally add `frontend/public/CNAME` containing `mohex.org` (this repo includes one) — Netlify will still require DNS changes.

4. Verify
- After successful deploy, visit https://mohex.org (or Netlify assigned URL) and verify frontend loads and can call the backend API.

Cross-origin & sockets
- The backend uses CORS and socket.io. Ensure Netlify domain (https://mohex.org) is allowed in CORS — this repo adds `https://mohex.org` and `https://www.mohex.org` to default CORS origins in [`backend/src/server.ts`](backend/src/server.ts:1).
- Ensure the frontend `NEXT_PUBLIC_API_BASE_URL` is set to the backend base URL and includes protocol (https://).

Security & secrets
- Store secrets in Heroku Config Vars & Netlify environment variables.
- Never commit `.env` with secrets to the repository.
- For databases, prefer managed DBs and set secure connection strings via provider config.

Deployment checklist (short)
- [ ] Confirm Heroku app exists and Config Vars are set.
- [ ] Confirm Netlify site is connected and environment variables set.
- [ ] Confirm `NEXT_PUBLIC_API_BASE_URL` points to backend (Heroku) and backend CORS allows the frontend domain.
- [ ] Validate `GET /health` on backend and that frontend fetches API endpoints successfully.

Developer tips & common commands
- Install frontend deps: cd frontend && npm install
- Install backend deps: cd backend && npm install
- Backend build: cd backend && npm run build
- Backend start (production): cd backend && npm start
- Frontend build: cd frontend && npm run build
- Frontend start (production, local): cd frontend && npm run start

Where things were configured in this repository
- Root Netlify config: [`netlify.toml`](netlify.toml:1) — sets frontend as base for Netlify builds.
- Frontend Netlify plugin: [`frontend/netlify.toml`](frontend/netlify.toml:1).
- Frontend CNAME: [`frontend/public/CNAME`](frontend/public/CNAME:1).
- Backend Node engine and Heroku build script: [`backend/package.json`](backend/package.json:1) and root [`package.json`](package.json:1) which includes `heroku-postbuild`.
- Backend Procfiles: root [`Procfile`](Procfile:1) and [`backend/procfile`](backend/procfile:1) are present.

If you want, I can:
- Provide exact Heroku CLI commands and environment variable examples (non-sensitive placeholders).
- Build and test locally here (I can run install/build commands if you allow executing commands).
- Create small sanity-check scripts to validate that API endpoints respond after deployment.