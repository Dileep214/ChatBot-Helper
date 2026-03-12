const EMERGENCY_KEYWORDS = [
    'seizure', 'unconscious', 'not breathing', 'choking', 'bleeding',
    'heavy bleeding', 'broken bone', 'poison', 'emergency', 'help me',
    'suicide', 'self-harm', 'severe allergic reaction', 'anaphylaxis'
];

/**
 * Middleware to check for high-priority emergency keywords
 */
const safetyFilter = (req, res, next) => {
    const { message } = req.body;

    if (!message) return next();

    const lowerMessage = message.toLowerCase();
    const detected = EMERGENCY_KEYWORDS.some(keyword => lowerMessage.includes(keyword));

    if (detected) {
        return res.status(200).json({
            isEmergency: true,
            response: "IMMEDIATE EMERGENCY DETECTED: If this is a life-threatening emergency, please call 911 (or your local emergency services) immediately. Our hospital's emergency room is open 24/7 at [Hospital Address].",
            actions: [
                { type: 'call', label: 'Call 911', number: '911' },
                { type: 'location', label: 'ER Location', address: '123 Hospital Lane' }
            ]
        });
    }

    next();
};

module.exports = safetyFilter;
