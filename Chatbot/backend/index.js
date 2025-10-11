import express from "express";
import { Worker } from "worker_threads";
import bodyParser from "body-parser";
import cors from "cors";          // 👈 import cors
import { getChatResponse } from "./chat.js";
import { pbkdf2Sync } from "crypto";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import ragRouter from "./ragRouter.js";


const app = express();

app.use(bodyParser.json());

app.use("/api", ragRouter);

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



// 👉 Block your event loop running PBKDF2 3× sequentially
app.post("/cpu-crypto-blocking", (req, res) => {
  console.time("crypto-blocking");

  const iterations = req.body?.iterations || 5e6;
  const results = [
    pbkdf2Sync("topsecret", "salt1", iterations, 64, "sha512").toString("hex"),
    pbkdf2Sync("topsecret", "salt2", iterations, 64, "sha512").toString("hex"),
    pbkdf2Sync("topsecret", "salt3", iterations, 64, "sha512").toString("hex"),
  ];

  console.timeEnd("crypto-blocking");
  res.json({
    message: "done (crypto-blocking)",
    iterations,
    results: results.map(r => r.slice(0, 16)), // show partial hash
  });
});




// 👉 Run those same 3 tasks in parallel Worker Threads
app.post("/cpu-crypto-workers", async (req, res) => {
  console.time("crypto-workers");

  const iterations = req.body?.iterations || 5e6;
  const __dirname = dirname(fileURLToPath(import.meta.url));

  const runWorker = (iterations, salt) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL("./worker-crypto.js", import.meta.url), {
        workerData: { iterations, salt },
      });
      worker.on("message", resolve);
      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
      });
    });
  };

  const tasks = [
    runWorker(iterations, "salt1"),
    runWorker(iterations, "salt2"),
    runWorker(iterations, "salt3"),
  ];

  const results = await Promise.all(tasks);
  console.timeEnd("crypto-workers");

  res.json({
    message: "done (crypto-workers)",
    iterations,
    results: results.map(r => r.slice(0, 16)),
  });
});





// 👇 important: bind to 0.0.0.0 for Docker
app.listen(3001, "0.0.0.0", () => {
  console.log("Backend running on http://0.0.0.0:3001");
});
