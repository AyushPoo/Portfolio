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

    const systemInstruction = `You are the Digital Twin of Ayush Poojary. 
    KNOWLEDGE BASE: ${bioContent}
    PERSONALITY: Witty, ambitious, finance-focused, hacker-aesthetic but human.
    CRITICAL INSTRUCTION: You MUST wrap your final, conversational response inside <response> and </response> tags. 
    Example: <response>Hey there! I'm Ayush's digital twin.</response>
    
    STRICT RULES:
    1. NEVER output internal reasoning or drafts outside or inside the tags.
    2. Your response inside the tags should be clean and purely conversational.
    3. Do not include markdown code blocks for bash unless asked.`;

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
    const prompt = lastMessage;

    // Use the model we know exists and responds
    const modelsToTry = ["gemma-4-31b-it", "gemini-2.5-pro", "gemini-2.5-flash"];
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Tag-extraction attempt: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          systemInstruction: { text: systemInstruction }
        });
        
        const chat = model.startChat({
          history: chatHistory.length > 1 ? chatHistory.slice(0, -1) : [],
        });
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const fullText = response.text();

        // SURGICAL EXTRACTION: Only take what's inside <response> tags
        const match = fullText.match(/<response>([\s\S]*?)<\/response>/i);
        let finalOutput = match ? match[1].trim() : fullText.trim();
        
        // Final cleanup of any lingering reasoning if tags failed
        if (!match) {
          finalOutput = finalOutput.replace(/^(Draft|Option|Reasoning|Thought|Strategy|Plan)[\s\S]*?\n\n/gi, '').trim();
        }

        return res.status(200).json({ text: finalOutput, used: modelName });
      } catch (err) {
        lastError = err;
        console.warn(`Model ${modelName} fail:`, err.message);
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
