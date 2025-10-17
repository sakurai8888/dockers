"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");

  const API_URL = "http://127.0.0.1:3001";

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();

    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage }),
      });

      if (!res.ok) throw new Error(`Backend error: ${res.status}`);

      const data = await res.json();
      const reply = data?.answer || data?.response || "No reply from server.";
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      console.error("❌ Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ " + err.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background = theme === "dark" ? "#111" : "#fff";
    document.body.style.color = theme === "dark" ? "#eee" : "#111";
  }, [theme]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // center horizontally
        height: "100vh",
        width: "100vw",
        background: theme === "dark" ? "#111" : "#fff",
        fontFamily: "sans-serif",
        color: theme === "dark" ? "#eee" : "#111",
      }}
    >
      {/* main column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          maxWidth: "800px", // limit width
          borderLeft:
            theme === "dark" ? "1px solid #333" : "1px solid #ddd",
          borderRight:
            theme === "dark" ? "1px solid #333" : "1px solid #ddd",
        }}
      >
        {/* Header */}
        <header
          style={{
            flexShrink: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 16px",
            borderBottom:
              theme === "dark" ? "1px solid #333" : "1px solid #ddd",
            background: theme === "dark" ? "#111" : "#fff",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "1.2rem" }}>🧠 Chat UI</h1>
          <button
            onClick={toggleTheme}
            style={{
              background: "none",
              border: "1px solid gray",
              borderRadius: 6,
              padding: "4px 8px",
              cursor: "pointer",
              color: "inherit",
            }}
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </header>

        {/* Messages */}
        <main
          style={{
            flexGrow: 1,
            overflowY: "auto",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            background: theme === "dark" ? "#222" : "#f9f9f9",
          }}
        >
          {messages.length === 0 && (
            <div style={{ color: "gray", textAlign: "center" }}>
              Type a message below to begin.
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                marginBottom: "0.5em",
                textAlign: m.sender === "user" ? "right" : "left",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "0.5em 0.8em",
                  borderRadius: 10,
                  background:
                    m.sender === "user"
                      ? theme === "dark"
                        ? "#2563eb"
                        : "#3b82f6"
                      : theme === "dark"
                      ? "#333"
                      : "#e5e7eb",
                  color: m.sender === "user" ? "#fff" : "inherit",
                  maxWidth: "75%",
                  wordBreak: "break-word",
                }}
              >
                {m.text}
              </span>
            </div>
          ))}

          {loading && (
            <div style={{ color: "gray", fontStyle: "italic" }}>
              Thinking...
            </div>
          )}
        </main>

        {/* Input bar */}
        <footer
          style={{
            flexShrink: 0,
            display: "flex",
            gap: 8,
            padding: "12px 16px",
            borderTop:
              theme === "dark" ? "1px solid #333" : "1px solid #ddd",
            background: theme === "dark" ? "#111" : "#fff",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            rows={2}
            style={{
              flexGrow: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ccc",
              background: theme === "dark" ? "#333" : "#fff",
              color: "inherit",
              resize: "none",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              padding: "10px 16px",
              border: "none",
              borderRadius: 8,
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            Send
          </button>
        </footer>
      </div>
    </div>
  );
}