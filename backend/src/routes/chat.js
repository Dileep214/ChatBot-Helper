const express = require('express');
const router = express.Router();
const safetyFilter = require('../middleware/safety');
const { chatController } = require('../controllers/chat.controller');

/**
 * Chat related routes - Modular and high performance
 */
router.post('/chat', safetyFilter, async (req, res, next) => {
    // In Express 5, async errors are handled automatically by default, but calling next(error) 
    // is still best practice for explicit control flow.
    try {
        await chatController(req, res, next);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
