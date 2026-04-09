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

    // Prepare model (Using the first one from your screenshot)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Personality Injection
    const personaPrefix = `[SYSTEM NOTE: You are Ayush AI, a quirky Digital Twin of Ayush Poojary. Context: ${bioContent}. Respond in a witty, vintage terminal style.]\n\n`;

    // Filter and format history
    const chatHistory = messages
      .filter(m => m.role === "user" || m.role === "assistant" || m.role === "model")
      .map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

    // Ensure it starts with user
    while (chatHistory.length > 0 && chatHistory[0].role !== "user") {
      chatHistory.shift();
    }

    const lastMessage = messages[messages.length - 1].content;
    const isFirstMessage = chatHistory.length <= 1;
    
    const chat = model.startChat({
      history: chatHistory.length > 0 ? chatHistory.slice(0, -1) : [],
    });

    // If it's the first message, prepend the persona
    const prompt = isFirstMessage ? personaPrefix + lastMessage : lastMessage;

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });
  } catch (error) {
    return res.status(500).json({ 
      error: error.message,
      hint: "Check your API key in Vercel settings."
    });
  }
}
