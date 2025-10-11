/**
 * ragFunctions.js
 * -------------------------------------------------------------
 * Helper functions:
 *  1. Create embeddings via Ollama
 *  2. Search PostgreSQL (pgvector)
 *  3. Generate a response from Ollama LLM
 * -------------------------------------------------------------
 */

import axios from "axios";
import dotenv from "dotenv";
import { pool } from "../db.js";

dotenv.config();

// Load environment variables
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const EMBED_MODEL = process.env.EMBED_MODEL || "nomic-embed-text";
const LLM_MODEL = process.env.LLM_MODEL || "llama3.2";

// ----------------------------------------------------------
// 1️⃣ Create Embedding via Ollama
// ----------------------------------------------------------
export async function createEmbedding(text) {
  console.log("🧠 Creating embedding...");

  const url = `${OLLAMA_URL}/api/embeddings`;
  const response = await axios.post(url, {
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
export async function searchVectorDB(embedding, topK = 5) {
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
export async function generateLLMResponse(question, contextDocs) {
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

  const url = `${OLLAMA_URL}/api/generate`;
  const response = await axios.post(url, {
    model: LLM_MODEL,
    prompt,
  });

  if (!response.data.response) {
    throw new Error("❌ Ollama did not return a valid response.");
  }

  return response.data.response.trim();
}