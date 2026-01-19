import express from "express";
import multer from "multer";
import fs from "fs";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// ✅ This is where you initialize OpenAI with the env variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "whisper-1"
    });

    fs.unlinkSync(req.file.path); // cleanup

    res.json({ text: response.text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Backend running"));
