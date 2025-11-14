// server.js
const path = require("path");
const express = require("express");
const compression = require("compression");

const app = express();
const PORT = process.env.PORT || 3000;

// Gzip responses
app.use(compression());

// Serve static files from build with long cache, but don't cache index.html
app.use(
  express.static(path.join(__dirname, "build"), {
    maxAge: "1y",
    immutable: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith("index.html")) {
        res.setHeader("Cache-Control", "no-store");
      }
    },
  })
);
// SPA fallback: send index.html for any non-file route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`React app listening on http://0.0.0.0:${PORT}`);
});