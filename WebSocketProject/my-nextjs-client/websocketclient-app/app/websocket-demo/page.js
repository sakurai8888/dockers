'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';

export default function WebSocketPage() {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  // Ref to hold the WebSocket instance
  const socketRef = useRef(null);
  const element = <h1>hello</h1>;

  useEffect(() => {
    // Ensure this code only runs in the browser
    if (typeof window === 'undefined') {
      return;
    }

    // Create a new WebSocket connection.
    // Use 'ws' for local development and 'wss' for production with HTTPS
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('WebSocket connection established');
      setConnectionStatus('Connected');
    };

    ws.onmessage = (event) => {
      console.log('Message from server: ', event.data);
      setReceivedMessages(prevMessages => [...prevMessages, { type: 'server', data: event.data }]);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setConnectionStatus('Disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error: ', error);
      setConnectionStatus('Error');
    };

    // Store the WebSocket instance in the ref
    socketRef.current = ws;
    setSocket(ws);

    // Cleanup function to close the WebSocket connection when the component unmounts
    return () => {
      if (ws.readyState === 1) { // <-- This is important
        ws.close();
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once

  const sendMessage = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && message.trim()) {
      socketRef.current.send(message);
      setReceivedMessages(prevMessages => [...prevMessages, { type: 'client', data: message }]);
      setMessage(''); // Clear input after sending
    } else {
      console.log('Cannot send message. WebSocket is not open.');
      alert('Connection is not open. Please wait or refresh the page.');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Real-Time WebSocket Client</h1>
        <p className={styles.status}>
          Connection Status: <span className={`${styles.statusIndicator} ${styles[connectionStatus.toLowerCase()]}`}></span> {connectionStatus}
        </p>

        <div className={styles.chatBox}>
          {receivedMessages.map((msg, index) => (
            <div key={index} className={`${styles.message} ${styles[msg.type]}`}>
              {msg.data}
            </div>
          ))}
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
            disabled={connectionStatus !== 'Connected'}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}