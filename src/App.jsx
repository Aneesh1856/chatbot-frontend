import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import axios from "axios";

// 🟡 Replace with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAkaDtDH_glGztHmdKXEpG80t_kny5rJ-0",
  authDomain: "gemini-chat-gdg.firebaseapp.com",
  projectId: "gemini-chat-gdg",
  storageBucket: "gemini-chat-gdg.firebasestorage.app",
  messagingSenderId: "121962710169",
  appId: "1:121962710169:web:1c644c0f0a207b078f6408"
};

initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const auth = getAuth();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSend = async () => {
    if (!input) return;
    const userMessage = { sender: "You", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post("https://chatbot-backend-rcge.onrender.com/chat", { message: input });
      const botMessage = { sender: "Gemini", text: res.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "System", text: "Error: Could not reach the server." }
      ]);
      console.error("Send error:", error);
    }

    setInput("");
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      {!user ? (
        <button onClick={handleLogin}>Sign in with Google</button>
      ) : (
        <>
          <h3>Welcome, {user.displayName} 👋</h3>
          <div style={{ border: "1px solid #ccc", padding: 10, height: 300, overflowY: "auto", marginBottom: 10 }}>
            {messages.map((msg, index) => (
              <div key={index}>
                <b>{msg.sender}:</b> {msg.text}
              </div>
            ))}
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            style={{ padding: 8, width: "60%" }}
          />
          <button onClick={handleSend} style={{ marginLeft: 10 }}>Send</button>
        </>
      )}
    </div>
  );
}

export default App;
