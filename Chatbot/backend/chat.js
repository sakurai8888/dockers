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
    model: "phi3",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: `Context: ${context}\n\nQuestion: ${userMessage}` }
    ]
  };

  const response = await fetch(`${process.env.OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let fullText = "";

  return new Promise((resolve, reject) => {
    response.body.on("data", (chunk) => {
      const lines = chunk.toString("utf8").split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.message?.content) {
            fullText += json.message.content;
          }
        } catch (err) {
          console.warn("⚠️ Skipping parse error on chunk:", line);
        }
      }
    });

    response.body.on("end", () => resolve(fullText.trim() || "No response from model"));
    response.body.on("error", reject);
  });
}