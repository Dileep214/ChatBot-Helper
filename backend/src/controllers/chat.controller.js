const { getRelevantContext } = require('../services/rag.service');
const { generateResponse } = require('../services/ai.service');
const logger = require('../utils/logger');

/**
 * Handle incoming chat requests
 * @route POST /api/chat
 */
const chatController = async (req, res, next) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message content is required'
            });
        }

        logger.info(`Processing chat request: ${message.substring(0, 50)}...`);

        // 1. Retrieve knowledge base context via RAG
        const context = await getRelevantContext(message);
        logger.debug(`Context found: ${context.substring(0, 50)}...`);

        // 2. Generate AI response powered by context
        let aiResponse = await generateResponse(message, context);

        // Detect appointment redirection trigger with extra safety guard
        let shouldRedirect = false;
        const APP_URL = "https://play.google.com/store/apps/details?id=com.docterz.connect.shankarchildrenshospital";

        if (aiResponse.includes('[ACTION:REDIRECT_APP]')) {
            // Hard safety check: Only allow redirect if user message actually relates to booking
            const bookingKeywords = ['book', 'appointment', 'schedule', 'doctor', 'visit', 'meeting'];
            const isBookingIntent = bookingKeywords.some(kw => message.toLowerCase().includes(kw));
            
            if (isBookingIntent) {
                shouldRedirect = true;
            }
            // Always strip the tag so it doesn't show to user
            aiResponse = aiResponse.replace('[ACTION:REDIRECT_APP]', '').trim();
        }

        logger.info(`Successfully generated AI response.`);

        // 3. Structured response for frontend stability
        res.status(200).json({
            success: true,
            data: {
                response: aiResponse,
                isEmergency: false,
                shouldRedirect,
                redirectUrl: shouldRedirect ? APP_URL : null,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        // Delegate to the global error handler
        next(error);
    }
};

module.exports = { chatController };
