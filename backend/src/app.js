const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/error.handler');
const chatRoutes = require('./routes/chat');

const app = express();

/**
 * 1. Security First Infrastructure
 */
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
    optionsSuccessStatus: 200
}));

/**
 * 2. High Observation Logging
 */
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: { write: (message) => logger.info(message.trim()) }
}));
app.use(express.json({ limit: '10kb' })); // Payload protection

/**
 * 3. Primary Business Routes
 */
app.use('/api', chatRoutes);

/**
 * 4. Health & Monitoring
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        message: 'Children\'s Hospital AI Assistant Backend is Operational',
        timestamp: new Date().toISOString()
    });
});

/**
 * 5. Error Management and Fallbacks
 */
app.use((req, res, next) => {
    const err = new Error(`Cannot find ${req.originalUrl} on this server!`);
    res.status(404);
    next(err);
});

// Final Error Handling Middleware
app.use(errorHandler);

module.exports = app;
