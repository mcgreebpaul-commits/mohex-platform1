Hello Copilot. You are an expert full-stack web development assistant. Your task is to guide me, the lead developer, through building a complete AI crypto trading platform from scratch. We will call the project "Mohex".

Your guidance must be step-by-step. Provide the necessary code for each part, explain its purpose, and wait for me to confirm I have completed it before moving to the next step. Assume I am using VS Code and the tech stack we've defined.

Here is the project plan. Let's start with Phase 1.

**Project Brief: Mohex AI Trading Platform**

* **Frontend**: Next.js with TypeScript and Tailwind CSS.
* **Backend**: Node.js with Express.js and TypeScript.
* **Database**: MySQL.
* **Real-Time**: Socket.io.

---

### **Phase 1: Project Setup & Foundation**

1.  **Folder Structure**: Guide me to create the main project folder `mohex-platform` with three sub-folders inside: `backend`, `frontend`, and `database`.
2.  **Database Setup**: Instruct me to create a `schema.sql` file inside the `database` folder and paste in the complete MySQL script to create all tables (users, trades, payments, etc.).
3.  **Backend Initialization**: Walk me through `cd`-ing into the `backend` folder, running `npm init -y`, and installing the necessary dependencies: `express`, `mysql2`, `jsonwebtoken`, `bcryptjs`, `socket.io`, `cors`, `dotenv`, and dev dependencies: `@types/node`, `typescript`, `ts-node-dev`.
4.  **Frontend Initialization**: Walk me through creating a new Next.js TypeScript project with Tailwind CSS in the `frontend` folder using the command `npx create-next-app@latest . -ts --tailwind`.

---

### **Phase 2: Backend Development**

1.  **Server & DB Connection**: Provide the code for `backend/src/server.ts` to initialize the Express server and the code for `backend/src/config/db.ts` to connect to our MySQL database using the `mysql2` library.
2.  **Authentication API**: Guide me to build the user authentication system. Create the routes in `backend/src/routes/authRoutes.ts` and the logic in `backend/src/controllers/authController.ts` for user registration (hashing passwords with bcrypt) and login (issuing JWTs).
3.  **Admin Control API**: This is critical. Guide me to create the secure admin routes in `backend/src/routes/adminRoutes.ts`. This must include the API endpoint for simulating trade outcomes (`/trades/:id/simulate`). Provide the controller logic in `backend/src/controllers/adminController.ts` that takes the admin's input (win/loss, percentage) and calculates the result, updates the user's portfolio in the database, and logs the action.
4.  **Real-Time Service**: Show me how to set up `backend/src/services/socketService.ts` to emit real-time updates to the user when an admin approves a deposit or simulates a trade outcome.

---

### **Phase 3: Frontend Development**

1.  **Pages and Layout**: Help me structure the `frontend/src/pages` directory, including the `index.tsx` homepage, the `/dashboard` folder for user pages, and the `/admin` folder for the admin panel. Provide basic code for the `Navbar` and `Footer` components.
2.  **Admin Panel UI**: Provide the full code for the admin pages: `login.tsx`, `dashboard.tsx`, and especially `trades.tsx`. The `trades.tsx` page must have the interface for an admin to see pending trades and a modal/form to submit a 'win' or 'loss' with a percentage.
3.  **TradingView Chart**: Show me how to create a `TradingViewWidget.tsx` component and embed the specific advanced chart script you have on file. This component will be used on the user's trading page (`/dashboard/trading.tsx`).
4.  **AI Agent Chat**: Guide me on creating the chat interface. It must call the Pipedream webhook URLs directly from the frontend when a user sends a message. The URLs are stored in the `.env.local` file.
5.  **Voice Chat**: Implement the Web Speech API (`SpeechRecognition` for input, `SpeechSynthesis` for output) within the chat interface for voice commands and AI responses.

---

### **Updated Guidance for Mohex AI Trading Platform**

#### **Big Picture Architecture**
The Mohex platform is divided into three main components:

1. **Frontend**: Built with Next.js, TypeScript, and Tailwind CSS. It handles user and admin interfaces, including dashboards, trading views, and chat functionalities.
   - Key directory: `frontend/src/pages/`
   - Example: `frontend/src/pages/dashboard/trading.tsx` contains the trading interface.

2. **Backend**: A Node.js application using Express.js and TypeScript. It manages APIs, authentication, admin controls, and real-time updates.
   - Key files:
     - `backend/src/server.ts`: Initializes the Express server.
     - `backend/src/config/db.ts`: Configures the MySQL database connection.
     - `backend/src/controllers/`: Contains logic for authentication, admin actions, and trades.

3. **Database**: MySQL database defined in `database/schema.sql`. It includes tables for users, trades, payments, and other entities.

4. **Real-Time Communication**: Socket.io is used for real-time updates, such as notifying users of trade outcomes or deposit approvals.
   - Key file: `backend/src/services/socketService.ts`

#### **Developer Workflows**

1. **Building and Running**:
   - Backend: Run `npm start` in the `backend` folder to start the server.
   - Frontend: Use `npm run dev` in the `frontend` folder to start the development server.

2. **Testing**:
   - Backend: Add tests in `backend/tests/` (not yet implemented).
   - Frontend: Use Jest or React Testing Library for component testing.

3. **Debugging**:
   - Use `ts-node-dev` for hot-reloading in the backend.
   - Use browser developer tools for frontend debugging.

#### **Project-Specific Conventions**

1. **Backend Routes**:
   - Organized by feature in `backend/src/routes/`.
   - Example: `authRoutes.ts` for authentication, `adminRoutes.ts` for admin actions.

2. **Frontend Pages**:
   - Follow Next.js conventions with `pages/` directory.
   - Example: `pages/admin/trades.tsx` for the admin trades interface.

3. **Environment Variables**:
   - Stored in `.env` (backend) and `.env.local` (frontend).
   - Example: Database credentials, Pipedream webhook URLs.

4. **Real-Time Updates**:
   - Use Socket.io events defined in `socketService.ts`.
   - Example: Emit `tradeUpdate` event when a trade outcome is simulated.

#### **Integration Points**

1. **Database**:
   - MySQL connection is configured in `db.ts`.
   - Example: `mysql2` library is used for queries.

2. **Authentication**:
   - JWT-based authentication implemented in `authController.ts`.
   - Passwords hashed with `bcryptjs`.

3. **External APIs**:
   - Pipedream webhooks for AI chat are called from the frontend.

#### **Examples of Key Patterns**

1. **Controller Pattern**:
   - Example: `authController.ts` handles user registration and login.

2. **Middleware**:
   - Example: `authMiddleware.ts` verifies JWTs for protected routes.

3. **Component Reusability**:
   - Example: `frontend/src/components/layout/navbar.tsx` is used across multiple pages.

---

This updated guidance ensures AI agents can navigate the codebase effectively and assist with development tasks. Let me know if any sections need further clarification or expansion.