import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import router from './routes/index.js';

// Import database configuration
import './config/db.js';

const app = express();
const server = createServer(app);

// Configure CORS origins from environment variable CORS_ORIGIN (supports a single origin or comma-separated list).
// Fallback to localhost and the existing Vercel preview URL when the env var is not set.
const defaultOrigins = [
  "http://localhost:3000",
  "https://mohex-frontend-5kllmi970-mcgreebpaul-commits-projects.vercel.app",
  "https://mohex.org",
  "https://www.mohex.org"
];
const corsEnv = process.env.CORS_ORIGIN;
let allowedOrigins: string | string[] = defaultOrigins;
if (corsEnv && typeof corsEnv === 'string' && corsEnv.trim() !== '') {
  const parsed = corsEnv.split(',').map(s => s.trim()).filter(Boolean);
  allowedOrigins = parsed.length === 1 ? parsed[0] : parsed;
}

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', router);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Mohex Backend API is running successfully.',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      user: '/api/user',
      admin: '/api/admin',
      health: '/health'
    },
    note: 'Frontend should be deployed separately and configured to use this API.'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Socket.io connection handling
io.on('connection', (socket: any) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 Socket.io server is ready`);
});

export { io, app, server };