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
const LLM_MODEL = process.env.LLM_MODEL || "gpt-oss:20b";

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

  if (!response.data?.embedding) {
    throw new Error("❌ No embedding returned from Ollama.");
  }

  return response.data.embedding;
}

// ----------------------------------------------------------
// 2️⃣ Search PostgreSQL Vector Store (pgvector)
// ----------------------------------------------------------
// Update: uses `document_chunks` table
export async function searchVectorDB(embedding, topK = 5) {
  console.log("🔍 Searching PostgreSQL vector DB (document_chunks)...");

  // Convert embedding array to pgvector-compatible string
  // Example: [0.1, 0.2, 0.3] → "[0.1,0.2,0.3]"
  const embeddingStr = `[${embedding.join(",")}]`;

  const sql = `
    SELECT 
      id,
      filename,
      chunk_index,
      content,
      1 - (embedding <=> $1::vector) AS similarity
    FROM document_chunks
    ORDER BY embedding <=> $1::vector
    LIMIT $2;
  `;

  const values = [embeddingStr, topK]; // use the stringified form

  const { rows } = await pool.query(sql, values);
  console.log(`✅ Found ${rows.length} similar chunks.`);
  return rows;
}
// ----------------------------------------------------------
// 3️⃣ Generate Response with Ollama LLM
// ----------------------------------------------------------
// Update: formats results to show filename + chunk index
export async function generateLLMResponse(question, contextDocs) {
  console.log("🤖 Generating final answer with Ollama...");

  const context = contextDocs
    .map(
      (doc, i) =>
        `# Chunk ${i + 1} — ${doc.filename} (chunk ${doc.chunk_index}):\n${doc.content}`
    )
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
  console.log(prompt)
  const url = `${OLLAMA_URL}/api/generate`;
  const response = await axios.post(url, {
    model: LLM_MODEL,
    prompt: prompt,
    stream: false
  });

  if (!response.data?.response) {
    throw new Error("❌ Ollama did not return a valid response.");
  }

  return response.data.response.trim();
}