const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const logger = require('./utils/logger');
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Chatbot Backend is Running 🚀");
});

/**
 * 2. High-Performance Database Connection 
 */
if (process.env.MONGODB_URI) {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => logger.info('Connected to MongoDB Atlas Strategy Storage'))
        .catch(err => {
            logger.error(`MongoDB connection error: ${err.message}`, { stack: err.stack });
            process.exit(1); // Fail fast in production for cluster stability
        });
} else {
    logger.warn('MONGODB_URI not found in environment. Running in volatile memory mode.');
}

/**
 * 3. Graceful Start Protocol
 */
const server = app.listen(PORT, () => {
    logger.info(`Server initialization complete on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'Development'}`);
});

/**
 * 4. Advanced Process Lifecycle Management
 */
process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down gracefully...', { error: err.message, stack: err.stack });
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    logger.warn('SIGTERM RECEIVED. Shutting down system safely.');
    server.close(() => {
        logger.info('Process terminated safely.');
    });
});
