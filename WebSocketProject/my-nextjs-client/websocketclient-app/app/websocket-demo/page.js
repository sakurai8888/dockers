'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';

export default function WebSocketPage() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const socketRef = useRef(null);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const handleConnect = () => {
    if (!username.trim()) {
      alert('Please enter a username.');
      return;
    }
    if (socketRef.current && socketRef.current.readyState !== WebSocket.CLOSED) {
      console.log('A connection is already open or connecting.');
      return;
    }
    setConnectionStatus('Connecting...');
    setReceivedMessages([]);
    const wsUrl = `ws://localhost:8080?username=${encodeURIComponent(username)}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connection established');
      setConnectionStatus('Connected');
    };

    // --- MODIFIED SECTION START ---
    ws.onmessage = (event) => {
      console.log('Message from server: ', event.data);
      let serverMessage;

      try {
        // Attempt to parse the message as JSON.
        // This will work for structured messages (chat, info broadcasts).
        serverMessage = JSON.parse(event.data);
      } catch (error) {
        // If parsing fails, it's a plain text message (e.g., the initial welcome message).
        // We'll wrap it in our standard object format for consistent rendering.
        console.warn("Received non-JSON message from server, treating as info:", event.data);
        serverMessage = { type: 'info', content: event.data };
      }
      
      // Add the processed message (either from JSON or the caught plain text) to the state.
      setReceivedMessages(prevMessages => [...prevMessages, serverMessage]);
    };
    // --- MODIFIED SECTION END ---

    ws.onclose = (event) => {
      console.log('WebSocket connection closed');
      const reason = event.reason || 'Connection lost.';
      setConnectionStatus('Disconnected');
      setReceivedMessages(prev => [...prev, { type: 'info', content: `Disconnected. ${reason}` }]);
      socketRef.current = null;
    };

    ws.onerror = (error) => {
      console.error('WebSocket error: ', error);
      setConnectionStatus('Error');
      setReceivedMessages(prev => [...prev, { type: 'info', content: 'Connection error.' }]);
    };

    socketRef.current = ws;
  };

  const handleDisconnect = () => {
    if (socketRef.current) {
      socketRef.current.close(1000, "User clicked disconnect");
    }
  };

  const sendMessage = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && message.trim()) {
      socketRef.current.send(message);
      const optimisticMessage = { type: 'message', sender: 'You', text: message };
      setReceivedMessages(prevMessages => [...prevMessages, optimisticMessage]);
      setMessage('');
    } else {
      console.log('Cannot send message. WebSocket is not open.');
      alert('Connection is not open.');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const renderMessage = (msg, index) => {
    if (msg.type === 'info') {
      return (
        <div key={index} className={`${styles.message} ${styles.info}`}>
          {msg.content}
        </div>
      );
    }
    if (msg.type === 'message') {
      const messageClass = msg.sender === 'You' ? styles.self : styles.server;
      return (
        <div key={index} className={`${styles.message} ${messageClass}`}>
          <strong>{msg.sender}:</strong> {msg.text}
        </div>
      );
    }
    return (
      <div key={index} className={`${styles.message} ${styles.server}`}>
        {typeof msg === 'object' ? JSON.stringify(msg) : msg}
      </div>
    );
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Real-Time WebSocket Client</h1>
        <p className={styles.status}>
          Connection Status: <span className={`${styles.statusIndicator} ${styles[connectionStatus.toLowerCase()]}`}></span> {connectionStatus}
        </p>

        {connectionStatus !== 'Connected' && (
          <div className={styles.connectionArea}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className={styles.input}
              disabled={connectionStatus === 'Connecting...'}
            />
            <button
              onClick={handleConnect}
              className={styles.button}
              disabled={connectionStatus === 'Connecting...'}
            >
              {connectionStatus === 'Connecting...' ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        )}

        {connectionStatus === 'Connected' && (
          <>
            <button onClick={handleDisconnect} className={`${styles.button} ${styles.disconnectButton}`}>
              Disconnect
            </button>

            <div className={styles.chatBox}>
              {receivedMessages.map(renderMessage)}
            </div>

            <div className={styles.inputArea}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className={styles.input}
                disabled={connectionStatus !== 'Connected'}
              />
              <button
                onClick={sendMessage}
                className={styles.button}
                disabled={connectionStatus !== 'Connected' || !message.trim()}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}