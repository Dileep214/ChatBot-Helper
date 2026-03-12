const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
const { generateResponse } = require('./services/ai.service');
const { getRelevantContext } = require('./services/rag.service');

async function test() {
    const usingGroq = !!process.env.GROQ_API_KEY;
    console.log('AI Service:', usingGroq ? 'Groq (Llama 3)' : 'OpenAI (GPT-3.5)');
    console.log('API Key:', (process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY) ? 'Present' : 'Missing');

    const queries = [
        "Hello",
        "Does the hospital have NICU?",
        "Who is the main doctor?",
        "What are the consultation hours?"
    ];

    for (const query of queries) {
        try {
            console.log(`\nQuery: ${query}`);
            const context = await getRelevantContext(query);
            console.log('Retrieved Context:', context.substring(0, 100) + '...');

            const res = await generateResponse(query, context);
            console.log('AI Response:', res);
        } catch (err) {
            console.error(`Test Failed for "${query}":`, err);
        }
    }
}

test();

