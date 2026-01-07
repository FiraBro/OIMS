import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Initialize the base instance
const genAIInstance = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Helper to ensure the AI client is ready.
 * This prevents "is not a function" errors and handles missing keys safely.
 */
const getClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "CRITICAL: GEMINI_API_KEY is missing in environment variables."
    );
  }
  return genAIInstance;
};

/**
 * PHASE A: Get Embeddings
 * Used for storing and searching FAQs in MongoDB.
 */
export const getEmbedding = async (text) => {
  try {
    const client = getClient();
    // Using 'text-embedding-004' (768 dimensions)
    const model = client.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Embedding Error:", error.message);
    throw error;
  }
};

/**
 * PHASE B: Get AI Answer
 * Uses Gemini 2.0 Flash (The 2026 standard for speed and accuracy).
 */
export const getAIAnswer = async (query, context) => {
  try {
    const client = getClient();
    // Using 'gemini-2.0-flash' which replaces the older 1.5 versions
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are a professional Online Insurance support bot for FiraBoss Insurance.
      
      CONTEXT FROM FAQ:
      ${context}
      
      USER QUESTION:
      ${query}
      
      INSTRUCTIONS:
      - Use ONLY the context above to answer.
      - If the answer is not found in the context, strictly say: "I don't know".
      - Keep the tone helpful but concise.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Answer Error:", error.message);
    // Return "I don't know" so your controller triggers the ticket creation
    return "I don't know";
  }
};
