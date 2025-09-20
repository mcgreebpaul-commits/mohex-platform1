// backend/src/services/socketservice.ts
import { Server } from 'socket.io';
import logger from '../utils/logger.js';
// A simple in-memory map to track users and their socket IDs
const userSocketMap = new Map();
class SocketService {
    static instance;
    io = null;
    constructor() { }
    static getInstance() {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }
    init(httpServer) {
        this.io = new Server(httpServer, {
            cors: {
                origin: process.env.FRONTEND_URL || "http://localhost:3000", // Your frontend URL
                methods: ["GET", "POST"]
            }
        });
        this.io.on('connection', (socket) => {
            logger.info(`A user connected: ${socket.id}`);
            // When a user logs in, they should emit this event with their user ID
            socket.on('register', (userId) => {
                if (userId) {
                    userSocketMap.set(userId, socket.id);
                    logger.info(`User ${userId} registered with socket ID ${socket.id}`);
                }
            });
            socket.on('disconnect', () => {
                logger.info(`User disconnected: ${socket.id}`);
                // Remove user from the map on disconnect
                for (const [userId, socketId] of userSocketMap.entries()) {
                    if (socketId === socket.id) {
                        userSocketMap.delete(userId);
                        logger.info(`User ${userId} unregistered.`);
                        break;
                    }
                }
            });
        });
        console.log('✅ Socket.IO service initialized.');
    }
    /**
     * Emits an event to a specific user if they are connected.
     * @param userId The ID of the user to send the event to.
     * @param eventName The name of the event (e.g., 'trade-update').
     * @param data The payload to send.
     */
    emitToUser(userId, eventName, data) {
        const socketId = userSocketMap.get(userId);
        if (socketId && this.io) {
            this.io.to(socketId).emit(eventName, data);
            logger.info(`Emitted event '${eventName}' to user ${userId}`);
        }
        else {
            logger.warn(`Could not emit event to user ${userId}: user not connected.`);
        }
    }
}
export const socketService = SocketService.getInstance();
