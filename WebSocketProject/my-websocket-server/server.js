import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';

const PORT = 8080;

// Initialize Express app and an HTTP server
const app = express();
app.use(cors()); // Allow cross-origin requests

const server = http.createServer(app);

// Initialize WebSocket server and attach it to the HTTP server
const wss = new WebSocketServer({ server });

// This endpoint is just for health checks, to see if the server is running
app.get('/', (req, res) => {
  res.send('WebSocket server is running.');
});

// Set up the WebSocket connection logic
wss.on('connection', (ws) => {
  console.log('✅ Client connected');

  // 1. Send an initial message to the client upon connection
  ws.send('Welcome! You are connected to the WebSocket server.');

  // 2. Handle incoming messages from the client
  ws.on('message', (message) => {
    const messageString = message.toString();
    console.log(`➡️ Received message: ${messageString}`);

    // Create a response with a timestamp
    const timestamp = new Date().toLocaleTimeString();
    const response = `Server received your message "${messageString}" at ${timestamp}`;

    // Send the response back to the client
    ws.send(response);
    console.log(`⬅️ Sent response: ${response}`);
  });

  // Handle connection closing
  ws.on('close', () => {
    console.log('❌ Client disconnected');
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server is listening on http://localhost:${PORT}`);
});