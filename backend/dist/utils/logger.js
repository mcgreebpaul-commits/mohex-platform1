// backend/src/utils/logger.ts
import winston, { format } from 'winston';
const { combine, timestamp, printf } = format;
// Custom log format
const logFormat = printf((info) => {
    const { level, message, timestamp } = info;
    return `${timestamp || ''} [${level}]: ${message}`;
});
const logger = winston.createLogger({
    level: 'info',
    format: combine(timestamp(), logFormat),
    transports: [
        // Console transport with colors
        new winston.transports.Console(),
        // File transport for error logs
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // File transport for all logs
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});
export default logger;
