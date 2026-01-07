import FAQ from "../models/faq.js";
import Ticket from "../models/faq.js";
import * as aiService from "../services/aiService.js";
import { cosineSimilarity } from "../services/vectorService.js";
export const handleChat = async (req, res) => {
  try {
    const { query, userId } = req.body;

    // 1. Convert query to vector
    const queryVector = await aiService.getEmbedding(query);

    // 2. Local Vector Search (The WOW Factor)
    const allFaqs = await FAQ.find({});
    const relatedFaqs = allFaqs
      .map((faq) => ({
        text: `Q: ${faq.question} A: ${faq.answer}`,
        score: cosineSimilarity(queryVector, faq.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 2); // Get top 2 results

    const contextText = relatedFaqs.map((f) => f.text).join("\n");

    // 3. Ask AI to answer based on FAQs
    const answer = await aiService.getAIAnswer(query, contextText);

    // 4. Resolve or Create Ticket
    if (answer.includes("I don't know") || relatedFaqs[0]?.score < 0.7) {
      const ticket = await Ticket.create({
        userId,
        userQuery: query,
        botDraft: answer,
      });
      return res.status(200).json({
        message:
          "I've created a support ticket for you as I couldn't find a clear answer.",
        ticketId: ticket._id,
        status: "unresolved",
      });
    }

    res.status(200).json({ answer, status: "resolved" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
