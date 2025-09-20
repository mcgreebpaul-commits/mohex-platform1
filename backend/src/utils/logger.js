"use strict";
// backend/src/utils/logger.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importStar(require("winston"));
const { combine, timestamp, printf } = winston_1.format;
// Custom log format
const logFormat = printf((info) => {
    const { level, message, timestamp } = info;
    return `${timestamp || ''} [${level}]: ${message}`;
});
const logger = winston_1.default.createLogger({
    level: 'info',
    format: combine(timestamp(), logFormat),
    transports: [
        // Console transport with colors
        new winston_1.default.transports.Console(),
        // File transport for error logs
        new winston_1.default.transports.File({ filename: 'error.log', level: 'error' }),
        // File transport for all logs
        new winston_1.default.transports.File({ filename: 'combined.log' }),
    ],
});
exports.default = logger;
