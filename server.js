import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";


const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Initialize Gemini Client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return null;

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    aiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

//created ankit

console.log("API Key present?", !!process.env.GEMINI_API_KEY);



// Primary AI endpoint
app.post("/api/ai", async (req, res) => {
  try {
    const {
      action,
      prompt,
      systemInstruction,
      responseFormat,
    } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        success: false,
        error: "GEMINI_API_KEY not configured. Falling back to Demo Mode.",
      });
    }

    const config = {};

    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    if (responseFormat === "json") {
      config.responseMimeType = "application/json";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config,
    });

    res.json({
      success: true,
      action,
      output: response.text,
    });
  } catch (error) {
    console.error("Gemini API error:", error?.message || error);

    res.status(500).json({
      success: false,
      error: error?.message || "Failed to generate AI response",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: "0.0.0.0",
        port: PORT,
      },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");

    app.use(express.static(distPath));

    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StudyOS AI Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});