import express from "express";
import bodyParser from "body-parser";
import { getChatResponse } from "./chat.js";

const app = express();
app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await getChatResponse(message);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Backend error" });
  }
});

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});