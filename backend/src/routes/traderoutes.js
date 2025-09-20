"use strict";
// backend/src/routes/traderoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tradecontrollers_1 = require("../controllers/tradecontrollers");
const authmiddleware_1 = require("../middleware/authmiddleware");
const router = (0, express_1.Router)();
// All routes in this file require the user to be authenticated
router.use(authmiddleware_1.authMiddleware);
// Portfolio routes
router.get('/portfolio', tradecontrollers_1.getPortfolio);
router.post('/deposit', tradecontrollers_1.submitDepositRequest);
// Trading routes
router.post('/trade/submit', tradecontrollers_1.submitTrade);
router.get('/trade/history', tradecontrollers_1.getTradeHistory);
exports.default = router;
