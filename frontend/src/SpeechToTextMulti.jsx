import React, { useState, useRef } from "react";

function SpeechToTextMulti() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [language, setLanguage] = useState("hi-IN");
  const [status, setStatus] = useState("idle");
  const recognitionRef = useRef(null);

  const createRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    return recognition;
  };

  const translateText = async (speechText) => {
    try {
      setStatus("translating");
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          speechText
        )}&langpair=${language.slice(0, 2)}|en`
      );
      const data = await res.json();
      setTranslated(data.responseData?.translatedText || "Translation failed");
      setStatus("done");
    } catch {
      setTranslated("Translation error");
      setStatus("error");
    }
  };

  const startListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();

    const recognition = createRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    setText("");
    setTranslated("");
    setStatus("listening");

    recognition.onresult = (event) => {
      const speechText = event.results?.[0]?.[0]?.transcript;
      if (!speechText) {
        setStatus("error");
        return;
      }
      setText(speechText);
      translateText(speechText);
    };

    recognition.onerror = () => setStatus("error");
    recognition.start();
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🎤 Speech to English Translator</h2>

        <select
          style={styles.select}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="hi-IN">Hindi</option>
          <option value="ta-IN">Tamil</option>
          <option value="ml-IN">Malayalam</option>
        </select>

        <button style={styles.button} onClick={startListening}>
          {status === "listening" ? "🎧 Listening..." : "🎙 Start Speaking"}
        </button>

        <div style={styles.box}>
          <h4>Original Speech</h4>
          <p>{text || "—"}</p>
        </div>

        <div style={styles.box}>
          <h4>English Translation</h4>
          <p>{translated || "—"}</p>
        </div>

        <p style={styles.status}>
          Status: <b>{status}</b>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "30px",
    width: "360px",
    boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    color: "#333",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "15px",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#667eea",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  box: {
    background: "#f5f6fa",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "12px",
    textAlign: "left",
  },
  status: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#555",
  },
};

export default SpeechToTextMulti;

