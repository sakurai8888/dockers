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
wss.on('connection', (ws,req) => {
  // log client request details. 
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const clientDetails = {
    ip: clientIp,
    url: req.url,
    userAgent: req.headers['user-agent'],
    origin: req.headers['origin'],
  };
  const fullUrl = new URL(req.url, `http://${req.headers.host}`);
  const wsusername = fullUrl.searchParams.get('username');
  ws.connectionusername = wsusername
  console.log(`✅ New client ${ws.connectionusername} connected! }`);
  console.log('   Client Details:', JSON.stringify(clientDetails.origin, null, 2));  
  
  // client connected. 
  console.log('✅ Client connected');
  console.log(wss.clients.size);

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



// Function to display details of connected clients
function displayClientDetails() {
  console.log('\n--- Connected Client Details ---');
  if (wss.clients.size === 0) {
    console.log('No clients currently connected.');
    return;
  }

  wss.clients.forEach(client => {
    // You can access default properties and any custom properties you've added
    console.log(`Client ID: ${client.id || 'N/A'}`);
    console.log(`Client Username: ${client.connectionusername || 'N/A'}`);
    console.log(`  Ready State: ${client.readyState}`); // WebSocket.OPEN, WebSocket.CONNECTING, etc.
    console.log(`  Last Message Time: ${new Date(client.lastMessageTime).toLocaleString()}`);
    // You can also access information from the underlying HTTP request if needed
    // console.log(`  Remote Address: ${client._socket.remoteAddress}`);
    // console.log(`  User Agent: ${client.upgradeReq.headers['user-agent']}`);
    console.log('------------------------------');
  });
}

// Call the function periodically or on demand to see client details
setInterval(displayClientDetails, 20000); // Display details every 5 seconds



// Start the server
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server is listening on http://localhost:${PORT}`);
});