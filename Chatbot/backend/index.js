import express from "express";
import bodyParser from "body-parser";
import cors from "cors";          // 👈 import cors
import { getChatResponse } from "./chat.js";

const app = express();

app.use(bodyParser.json());

// ✅ Enable CORS for your frontend
// In dev, allow http://localhost:3000
// (or use app.use(cors()) to allow everything)
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await getChatResponse(message);
    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Backend error" });
  }
});

// 👇 important: bind to 0.0.0.0 for Docker
app.listen(3001, "0.0.0.0", () => {
  console.log("Backend running on http://0.0.0.0:3001");
});