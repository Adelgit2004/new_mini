import React, { useState } from "react";

function SpeechToTextMulti() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [language, setLanguage] = useState("hi-IN");

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;

    recognition.onresult = async (event) => {
      const speechText = event.results[0][0].transcript;
      setText(speechText);

      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          speechText
        )}&langpair=${language.slice(0, 2)}|en`
      );

      const data = await res.json();
      setTranslated(data.responseData.translatedText);
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

      <button onClick={startListening}>🎙 Speak</button>

      <p><b>Original:</b> {text}</p>
      <p><b>English:</b> {translated}</p>
    </div>
  );
}

export default SpeechToTextMulti;
