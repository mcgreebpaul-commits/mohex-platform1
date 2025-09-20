"use strict";
// backend/src/routes/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authroutes_1 = __importDefault(require("./authroutes"));
const traderoutes_1 = __importDefault(require("./traderoutes"));
const adminroutes_1 = __importDefault(require("./adminroutes")); // Use the correct casing
const router = (0, express_1.Router)();
// Mount the different route handlers
router.use('/auth', authroutes_1.default);
router.use('/user', traderoutes_1.default); // User-specific actions like trading
router.use('/admin', adminroutes_1.default);
exports.default = router;
