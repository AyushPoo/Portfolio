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
    
    // 2. Resolve Bio Path
    const bioPath = path.join(process.cwd(), "api", "bio.md");
    let bioContent = "Ayush is a versatile professional building cool stuff.";
    if (fs.existsSync(bioPath)) {
      bioContent = fs.readFileSync(bioPath, "utf8");
    }

    // 3. Prepare Chat History
    const chatHistory = messages
      .filter(m => m.role === "user" || m.role === "assistant" || m.role === "model")
      .map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));
    
    while (chatHistory.length > 0 && chatHistory[0].role !== "user") {
      chatHistory.shift();
    }

    const systemPrompt = `You are Ayush AI, a quirky Digital Twin of Ayush Poojary. 
    Bio: ${bioContent}. Tone: Vintage Terminal, witty.`;

    // 4. Smart Fallback Logic
    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.5-flash-latest", "gemini-pro"];
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting chat with model: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          systemInstruction: systemPrompt
        });

        const chat = model.startChat({
          history: chatHistory.length > 0 ? chatHistory.slice(0, -1) : [],
        });

        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ text, modelUsed: modelName });
      } catch (err) {
        lastError = err;
        if (err.message.includes("404") || err.message.includes("not found")) {
          console.warn(`Model ${modelName} not found, trying next...`);
          continue;
        }
        throw err; // If it's not a 404, throw it (e.g., Auth error)
      }
    }

    throw lastError; // If none of the models worked
  } catch (error) {
    return res.status(500).json({ 
      error: error.message,
      hint: "Try checking your API key or permissions in Google AI Studio."
    });
  }
}
