const { GoogleGenerativeAI } = require("@google/generative-ai");

require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // There isn't a direct listModels on the client instance in some versions, 
        // but let's try to just hit the API or see what error we get, 
        // actually the error message says "Call ListModels to see the list".
        // The node SDK might have a different way to list models.
        // Let's try to use the rest API via fetch if sdk doesn't support it easily or just try a standard known model.

        // Actually, let's try to use the API key to fetch the models list via REST using node-fetch or native fetch
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("Error listing models:", data);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
