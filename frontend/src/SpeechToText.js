import React, { useState } from "react";

function SpeechToText() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);

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

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.start();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎤 Speech to Text (AI)</h2>

      <button onClick={startListening}>
        {listening ? "Listening..." : "Speak"}
      </button>

      <textarea
        rows="5"
        value={text}
        placeholder="Your speech will appear here..."
        style={{ width: "100%", marginTop: "10px" }}
        readOnly
      />
    </div>
  );
}

export default SpeechToText;
