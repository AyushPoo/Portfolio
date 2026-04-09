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
    
    // 1. DEBUG: List authorized models to find the right name
    const modelList = await genAI.listModels();
    const authorizedModels = modelList.models.map(m => m.name);
    console.log("Authorized Models:", authorizedModels);

    // Resolve Bio
    const bioPath = path.join(process.cwd(), "api", "bio.md");
    let bioContent = "Ayush is a versatile professional.";
    if (fs.existsSync(bioPath)) {
      bioContent = fs.readFileSync(bioPath, "utf8");
    }

    // Try a model from the authorized list if possible, or fallback
    const modelName = authorizedModels.find(m => m.includes("flash")) || authorizedModels[0] || "gemini-1.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    const personaPrefix = `[SYSTEM NOTE: You are Ayush AI. Context: ${bioContent}. Respond in a witty terminal style.]\n\n`;

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
    
    const chat = model.startChat({
      history: chatHistory.length > 0 ? chatHistory.slice(0, -1) : [],
    });

    const prompt = isFirstMessage ? personaPrefix + lastMessage : lastMessage;

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text, usedModel: modelName });
  } catch (error) {
    // Return the authorized models back to the UI so we can see them!
    let authModels = [];
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const list = await genAI.listModels();
      authModels = list.models.map(m => m.name);
    } catch (e) {}

    return res.status(500).json({ 
      error: error.message,
      authorizedModels: authModels,
      hint: "Check the 'authorizedModels' list above to find a valid model name for your key."
    });
  }
}
