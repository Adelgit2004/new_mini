import React, { useState } from "react";

function SpeechToText() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("Idle");

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    setListening(true);
    setStatus("Listening...");

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      setListening(false);
      setStatus("Done");
    };

    recognition.onerror = (err) => {
      console.error(err);
      setListening(false);
      setStatus("Error occurred. Try again!");
    };

    recognition.start();
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🎤 Speech to Text (AI)</h2>

        <button style={styles.button} onClick={startListening}>
          {listening ? "🎧 Listening..." : "🎙 Speak"}
        </button>

        <p style={styles.status}>Status: {status}</p>

        <textarea
          rows="5"
          value={text}
          placeholder="Your speech will appear here..."
          readOnly
          style={styles.textarea}
        />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 30,
    width: 380,
    boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  title: {
    marginBottom: 20,
    color: "#333",
  },
  button: {
    padding: "12px 20px",
    width: "100%",
    fontSize: 16,
    borderRadius: 10,
    border: "none",
    background: "#667eea",
    color: "#fff",
    cursor: "pointer",
    marginBottom: 15,
  },
  status: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  textarea: {
    width: "100%",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    border: "1px solid #ccc",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
    resize: "none",
  },
};

export default SpeechToText;
