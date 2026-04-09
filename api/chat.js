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

    const personaPrefix = `System: You are Ayush Poojary's Digital Twin.
Traits: Witty, finance-savvy, tech-forward, slightly quirky.
Context: ${bioContent}
Instructions: Respond as Ayush in a conversational way. Support the terminal aesthetic with your tone, but do NOT output bash commands or shell code blocks unless specifically asked. Stay human and approachable.`;

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
    const prompt = isFirstMessage ? personaPrefix + "\n\nUser: " + lastMessage : lastMessage;

    // VERIFIED MODEL LIST FROM AI STUDIO SNIFFING
    const modelsToTry = ["gemma-4-31b-it", "gemini-2.5-pro", "gemini-2.5-flash", "gemini-1.5-flash"];
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting verified model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Use generateContent for the first message (simpler), chat for subsequent
        if (isFirstMessage) {
          const result = await model.generateContent(prompt);
          const response = await result.response;
          return res.status(200).json({ text: response.text(), used: modelName });
        } else {
          const chat = model.startChat({
            history: chatHistory.slice(0, -1),
          });
          const result = await chat.sendMessage(prompt);
          const response = await result.response;
          return res.status(200).json({ text: response.text(), used: modelName });
        }
      } catch (err) {
        lastError = err;
        console.warn(`Model ${modelName} unavailable:`, err.message);
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
