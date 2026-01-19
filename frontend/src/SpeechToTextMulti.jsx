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
    } catch (err) {
      console.error("Translation error:", err);
      setTranslated("Translation error");
      setStatus("error");
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

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

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);

      // Retry once for common issues
      if (event.error === "no-speech" || event.error === "network") {
        setTimeout(() => recognition.start(), 800);
      } else {
        setStatus("error");
      }
    };

    recognition.onend = () => {
      if (status === "listening") setStatus("idle");
    };

    recognition.start();
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>🎤 Indian Language Speech → English</h3>

      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="hi-IN">Hindi</option>
        <option value="ta-IN">Tamil</option>
        <option value="ml-IN">Malayalam</option>
      </select>

      <br /><br />

      <button onClick={startListening}>
        {status === "listening" ? "🎧 Listening..." : "🎙 Speak"}
      </button>

      <p><b>Status:</b> {status}</p>
      <p><b>Original:</b> {text}</p>
      <p><b>English:</b> {translated}</p>
    </div>
  );
}

export default SpeechToTextMulti;
