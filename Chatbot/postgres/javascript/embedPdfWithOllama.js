import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs"; // ✅ for v4
import pg from "pg";
import axios from "axios";
import "dotenv/config";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// --- support __dirname in ES modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Extract text from PDF with pdfjs-dist
async function extractTextFromPdf(filePath) {
  console.log("📄 Reading PDF with pdfjs-dist v4:", filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error("❌ File not found at: " + filePath);
  }

  const rawData = new Uint8Array(fs.readFileSync(filePath));
  const pdfDoc = await pdfjsLib.getDocument({ data: rawData }).promise;

  let allText = "";

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((t) => t.str);
    allText += strings.join(" ") + "\n";
  }

  return allText;
}

// 2. Split into chunks with overlap
function chunkText(text, chunkSize = 800, overlap = 100) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start = end - overlap;
  }
  return chunks;
}

// 3. Call Ollama embeddings API
async function getEmbedding(text) {
  const resp = await axios.post("http://localhost:11434/api/embeddings", {
    model: "nomic-embed-text",
    prompt: text,
  });
  return resp.data.embedding;
}

// 4. Full pipeline: extract → chunk → embed → store
async function embedAndStorePdf(filePath) {
  const text = await extractTextFromPdf(filePath);
  const chunks = chunkText(text);

  console.log(`📑 Extracted ${chunks.length} chunks from PDF: ${filePath}`);

  for (const chunk of chunks) {
    if (!chunk.trim()) continue;

    const embedding = await getEmbedding(chunk);

    await pool.query(
      `INSERT INTO pdf_chunks (content, embedding, source)
       VALUES ($1, $2, $3)`,
      [chunk, embedding, filePath]
    );
  }

  console.log("✅ All chunks embedded and stored in Postgres.");
}

// ---- CLI entry point ----
const inputFile = process.argv[2];
if (!inputFile) {
  console.error("❌ Please provide a PDF file path. Example:");
  console.error('   node embedPdfWithOllama.js "./faq_sample_01.pdf"');
  process.exit(1);
}

const resolvedPath = path.resolve(process.cwd(), inputFile);
console.log("📂 Resolved path:", resolvedPath);

embedAndStorePdf(resolvedPath)
  .then(() => pool.end())
  .catch((err) => {
    console.error("❌ Error:", err);
    pool.end();
  });