const fs = require('fs');
const path = require('path');

/**
 * Basic Local RAG Implementation
 * Using the new JSON dataset for structured context retrieval.
 */
const getRelevantContext = async (query) => {
    try {
        const filePath = path.join(__dirname, '../../data/hospital_rag_dataset.json');
        const dataset = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Improved matching: stem common words and check for specific synonyms
        const queryLower = query.toLowerCase();
        const queryTerms = queryLower.split(/\W+/).filter(t => t.length > 2);
        
        // Add synonyms for common queries
        if (queryLower.includes('timing') || queryLower.includes('hours') || queryLower.includes('open')) {
            queryTerms.push('timing', 'hours', 'consultation');
        }

        let scoredChunks = dataset.map(chunk => {
            let score = 0;
            const contentLower = chunk.content.toLowerCase();
            const titleLower = chunk.title.toLowerCase();

            queryTerms.forEach(term => {
                // Check for both singular and plural (primitive stemming)
                const termRoot = term.endsWith('s') ? term.slice(0, -1) : term;
                
                if (titleLower.includes(termRoot)) score += 5; 
                if (contentLower.includes(termRoot)) score += 2;
                
                // Bonus for exact matches
                if (titleLower.includes(term)) score += 2;
                if (contentLower.includes(term)) score += 1;
            });

            return { ...chunk, score };
        });

        const relevantChunks = scoredChunks
            .filter(chunk => chunk.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5); // Increased slice to ensure we don't miss relevant info

        if (relevantChunks.length === 0) {
            return "General information about Shankar Children's Hospital.";
        }

        return relevantChunks.map(c => `[${c.title}]: ${c.content}`).join('\n\n');
    } catch (error) {
        console.error('RAG Service error:', error);
        return "Standard hospital services information.";
    }
};

module.exports = { getRelevantContext };

