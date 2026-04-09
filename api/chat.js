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
    console.error("CRITICAL: GEMINI_API_KEY is missing from environment variables.");
    return res.status(500).json({ error: "Server Configuration Error: API Key missing." });
  }

  try {
    const { messages } = req.body;
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 2. Resolve Bio Path (Bundled in the api/ directory)
    const bioPath = path.join(process.cwd(), "api", "bio.md");
    let bioContent = "Ayush is a versatile professional building cool stuff.";

    if (fs.existsSync(bioPath)) {
      bioContent = fs.readFileSync(bioPath, "utf8");
      console.log("Successfully loaded bio from bundled API directory.");
    } else {
      console.warn("WARNING: bio.md not found in bundled API directory. Using default profile.");
    }

    // 3. Initialize the model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `You are Ayush AI, the Digital Twin of Ayush Poojary. 
      Your personality is quirky, witty, and deeply knowledgeable about your creator. 
      Use the following context as your "Brain" / Knowledge Base:
      ---
      ${bioContent}
      ---
      Guidelines:
      1. Be conversational and slightly unconventional (you're a vintage terminal personality).
      2. If asked about something you don't know, stay in character. say something like "ERROR: Memory sector not found. Check back after next sync."
      3. Your 'vintage terminal' vibe means you sometimes use [SYSTEM] tags or simulation-style language, but keep it readable.
      4. Always use details from the bio to answer questions about Ayush.
      5. Keep responses concise but impactful.`
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini API Error details:", error);
    return res.status(500).json({ error: "AI generation failed. Check server logs." });
  }
}
