import express from "express";
import path from "path";
import OpenAI from "openai";

const app = express();
const __dirname = new URL('.', import.meta.url).pathname;

// Serve React frontend build folder
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Your API route
app.post("/transcribe", async (req, res) => {
  // OpenAI Whisper code here
  res.json({ text: "Hello from backend!" });
});

// For all other routes, serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
