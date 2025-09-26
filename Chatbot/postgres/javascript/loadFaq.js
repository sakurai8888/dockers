import fetch from "node-fetch";
import pkg from "pg";
const { Pool } = pkg;

// --- 1. Setup DB connection ---
const pool = new Pool({
  user: process.env.PGUSER || "user",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "chatbot",
  password: process.env.PGPASSWORD || "password",
  port: process.env.PGPORT || 5432,
});

// --- 2. Example FAQ array you want to embed ---
const faq = [
  {
    question: "What are your opening hours?",
    answer: "We are open Monday to Friday, from 9 AM to 6 PM.",
  },
  {
    question: "Where are you located?",
    answer: "Our main office is in Nairobi, Kenya.",
  },
  {
    question: "Do you provide online consultations?",
    answer: "Yes, we offer online consultations via Zoom by appointment.",
  },
];

// --- 3. Function to call Ollama embedding model ---
async function getEmbedding(text) {
  const response = await fetch("http://localhost:11434/api/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "nomic-embed-text", // change to the Ollama embedding model you pulled
      prompt: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama embedding error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.embedding; // should be an array of floats
}

// --- 4. Load FAQ into DB ---
async function loadFaq() {
  for (const entry of faq) {
    const text = `${entry.question} ${entry.answer}`;
    console.log(`Embedding: ${text}`);

    const embedding = await getEmbedding(text);
     const pgVector = "[" + embedding.join(",") + "]"; // convert to pgvector format

    await pool.query(
      `INSERT INTO faq (question, answer, embedding)
       VALUES ($1, $2, $3)`,
      [entry.question, entry.answer, pgVector]
    );
  }

  console.log("✅ FAQ loaded with embeddings");
  await pool.end();
}

// Run script
loadFaq().catch(err => {
  console.error("Error loading FAQ:", err);
  process.exit(1);
});