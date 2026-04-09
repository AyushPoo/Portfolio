import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  // 1. Initial Checks
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ 
      error: "GEMINI_API_KEY is missing from Vercel Environment Variables.",
      help: "Please add GEMINI_API_KEY in your Vercel Project Settings -> Environment Variables and redeploy."
    });
  }

  try {
    const { messages } = req.body;
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Resolve Bio
    const bioPath = path.join(process.cwd(), "api", "bio.md");
    let bioContent = "Ayush is a versatile professional.";
    if (fs.existsSync(bioPath)) {
      bioContent = fs.readFileSync(bioPath, "utf8");
    }

    const personaPrefix = `[SYSTEM NOTE: You are Ayush AI. Context: ${bioContent}. Respond in a witty terminal style.]\n\n`;

    // Filter and format history
    const chatHistory = messages
      .filter(m => m.role === "user" || m.role === "assistant" || m.role === "model")
      .map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

    while (chatHistory.length > 0 && chatHistory[0].role !== "user") {
      chatHistory.shift();
    }

    const lastMessage = messages[messages.length - 1].content;
    const isFirstMessage = chatHistory.length <= 1;
    const prompt = isFirstMessage ? personaPrefix + lastMessage : lastMessage;

    // BRUTE FORCE FALLBACK
    const modelsToTry = ["gemma-4-31b", "gemini-2.5-flash", "gemini-1.5-flash", "gemma-2-9b-it"];
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying specialized model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const chat = model.startChat({
          history: chatHistory.length > 0 ? chatHistory.slice(0, -1) : [],
        });
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();
        return res.status(200).json({ text, used: modelName });
      } catch (err) {
        lastError = err;
        console.warn(`Failed with ${modelName}:`, err.message);
        continue;
      }
    }

    throw lastError;
  } catch (error) {
    return res.status(500).json({ 
      error: error.message,
      hint: "All specialized models failed. Please verify your API key and region in Vercel."
    });
  }
}
