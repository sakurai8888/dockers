import express from "express";
import { Worker } from "worker_threads";
import bodyParser from "body-parser";
import cors from "cors";          // 👈 import cors
import { getChatResponse } from "./chat.js";

const app = express();

app.use(bodyParser.json());



function heavyTask(iterations = 5e8) {
  let sum = 0;
  for (let i = 0; i < iterations; i++) {
    sum += i;
  }
  return sum;
}

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


app.post("/benchmark", (req, res) => {
  // Simulate light JSON processing
  const { n = 1 } = req.body || {};
  const result = n + 1;

  // Return a small JSON to mimic real API behavior
  res.json({ ok: true, result });
});


app.post("/cpu-sum", (req, res) => {
  let sum = 0;
  const limit = 5e8; // 500 million iterations
  for (let i = 0; i < limit; i++) {
    sum += i;
  }
  res.json({ message: "done", sum });
});




app.post("/cpu-blocking", async (req, res) => {
  console.time("blocking");

  // Run 3 heavy tasks sequentially
  const results = [];
  for (let i = 0; i < 3; i++) {
    results.push(heavyTask(3e8));
  }

  console.timeEnd("blocking");
  res.json({ message: "done (blocking)", results });
});





// ---------- 2️⃣ Endpoint — With Worker Threads ----------
app.post("/cpu-workers", async (req, res) => {
  console.time("workers");

  const runWorker = (iterations) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL("./worker.js", import.meta.url), {
        workerData: iterations,
      });
      worker.on("message", resolve);
      worker.on("error", reject);
    });
  };

  // Run 3 workers simultaneously
  const tasks = [runWorker(3e8), runWorker(3e8), runWorker(3e8)];
  const results = await Promise.all(tasks);

  console.timeEnd("workers");
  res.json({ message: "done (workers)", results });
});





// 👇 important: bind to 0.0.0.0 for Docker
app.listen(3001, "0.0.0.0", () => {
  console.log("Backend running on http://0.0.0.0:3001");
});
