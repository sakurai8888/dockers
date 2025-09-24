import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    const res = await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setMessages([...messages, { sender: "user", text: input }, { sender: "bot", text: data.reply }]);
    setInput("");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Chatbot UI</h1>
      <div style={{ marginBottom: "1em" }}>
        {messages.map((m, i) => (
          <p key={i}><b>{m.sender}:</b> {m.text}</p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "70%" }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}