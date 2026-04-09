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
    } else {
      console.warn("bio.md not found, using fallback.");
    }

    // 3. Initialize the model (Switching to Gemma 2 27B as requested)
    const model = genAI.getGenerativeModel({ 
      model: "gemma-2-27b-it"
    });

    // 4. Prepare and Filter Chat History
    const chatHistory = messages
      .filter(m => m.role === "user" || m.role === "assistant" || m.role === "model")
      .map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));
    
    // Ensure history starts with 'user'
    while (chatHistory.length > 0 && chatHistory[0].role !== "user") {
      chatHistory.shift();
    }

    // Since Gemma might not always support 'systemInstruction' property in the same way,
    // we inject the bio/persona into the very first message if possible.
    const systemPrompt = `SYSTEM_INSTRUCTION: You are Ayush AI, a quirky Digital Twin of Ayush Poojary. 
    Use this bio: ${bioContent}. 
    Tone: Vintage Terminal, witty, conversational.`;

    const chat = model.startChat({
      history: chatHistory.length > 0 ? chatHistory.slice(0, -1) : [],
    });

    // Inject system persona into the prompt
    const lastMessage = messages[messages.length - 1].content;
    const finalPrompt = chatHistory.length <= 1 
      ? `${systemPrompt}\n\nUSER_MESSAGE: ${lastMessage}`
      : lastMessage;

    const result = await chat.sendMessage(finalPrompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });
  } catch (error) {
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack,
      hint: "Check if the API key is valid and the model 'gemini-1.5-flash' is accessible."
    });
  }
}
