import fetch from "node-fetch";
import { pool } from "./db.js";

async function searchDocs(query) {
  const client = await pool.connect();
  // TODO: add proper embedding similarity search
  const result = await client.query("SELECT content FROM documents LIMIT 1;");
  client.release();
  return result.rows.map(r => r.content).join("\n");
}

export async function getChatResponse(userMessage) {
  const context = await searchDocs(userMessage);

  const payload = {
    model: "phi3", // replace with your Ollama model
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: `Context: ${context}\n\nQuestion: ${userMessage}` }
    ]
  };

  const response = await fetch(`${process.env.OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  return data.message?.content || "No response from model";
}