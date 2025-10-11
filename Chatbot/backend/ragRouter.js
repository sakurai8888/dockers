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
import axios from "axios";
import dotenv from "dotenv";
import { pool } from "./db.js"; // ✅ import your existing pool

dotenv.config();

const router = express.Router();

const OLLAMA_API = process.env.OLLAMA_API || "http://localhost:11434/api";
const EMBED_MODEL = process.env.EMBED_MODEL || "nomic-embed-text";
const LLM_MODEL = process.env.LLM_MODEL || "llama3.2";

// ----------------------------------------------------------
// 1️⃣ Create Embedding from Query Text (Ollama)
// ----------------------------------------------------------
async function createEmbedding(text) {
  console.log("🧠 Creating embedding...");
  const response = await axios.post(`${OLLAMA_API}/embeddings`, {
    model: EMBED_MODEL,
    prompt: text,
  });

  if (!response.data.embedding) {
    throw new Error("❌ No embedding returned from Ollama.");
  }

  return response.data.embedding;
}

// ----------------------------------------------------------
// 2️⃣ Search PostgreSQL Vector Store (pgvector)
// ----------------------------------------------------------
async function searchVectorDB(embedding, topK = 5) {
  console.log("🔍 Searching PostgreSQL vector DB...");

  const sql = `
    SELECT id, content,
           1 - (embedding <=> $1::vector) AS similarity
    FROM documents
    ORDER BY embedding <=> $1::vector
    LIMIT $2;
  `;

  const { rows } = await pool.query(sql, [embedding, topK]);
  return rows;
}

// ----------------------------------------------------------
// 3️⃣ Generate Response with Ollama LLM
// ----------------------------------------------------------
async function generateLLMResponse(question, contextDocs) {
  console.log("🤖 Generating final answer with Ollama...");

  const context = contextDocs
    .map((doc, i) => `# Document ${i + 1}:\n${doc.content}`)
    .join("\n\n");

  const prompt = `
You are a helpful assistant. Use the following CONTEXT to answer the QUESTION.
If the answer cannot be inferred, say "I don’t know based on the provided context."

CONTEXT:
${context}

QUESTION:
${question}

ANSWER:
`;

  const response = await axios.post(`${OLLAMA_API}/generate`, {
    model: LLM_MODEL,
    prompt,
  });

  if (!response.data.response) {
    throw new Error("❌ Ollama did not return a valid response.");
  }

  return response.data.response.trim();
}

// ----------------------------------------------------------
// 🚀 Route: POST /api/ask
// ----------------------------------------------------------
router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Missing 'question' field in body." });
    }

    console.log(`\n📝 Question: ${question}`);

    // Step 1 - Create embedding
    const embedding = await createEmbedding(question);
    // Step 2 - Search PostgreSQL (vector similarity)
    const matches = await searchVectorDB(embedding, 5);
    // Step 3 - Send results + question to Ollama
    const answer = await generateLLMResponse(question, matches);

    res.json({
      question,
      answer,
      contextUsed: matches,
    });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;