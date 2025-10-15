/**
 * ragRouter.js
 * -------------------------------------------------------------
 * Routes:
 *   POST /api/ask
 * Steps:
 *   1. Create embedding with Ollama
 *   2. Perform vector search in PostgreSQL
 *   3. Send context + question to Ollama LLM
 * -------------------------------------------------------------
 */

import express from "express";
import {
  createEmbedding,
  searchVectorDB,
  generateLLMResponse,
} from "./utilities/ragFunctions.js";

const myrouter = express.Router();

// ----------------------------------------------------------
// 🚀 Route: POST /api/ask
// ----------------------------------------------------------
myrouter.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Missing 'question' field in body." });
    }

    console.log(`\n📝 Question received:\n${question}`);

    // Step 1 - Create embedding
    const embedding = await createEmbedding(question);

    // Step 2 - Search PostgreSQL (vector similarity)
    const matches = await searchVectorDB(embedding, 5);

    // Step 3 - Generate final answer using Ollama
    const answer = await generateLLMResponse(question, matches);

    return res.json({
      question,
      answer,
      contextUsed: matches,
    });
  } catch (err) {
    console.error("❌ Error in /api/ask route:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default myrouter;