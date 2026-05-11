import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import {
  buildKnowledgeBase,
  getModelsToTry,
  sanitizeModelError,
} from "./chat-helpers.js";

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
    const lastMessage = messages[messages.length - 1].content;
    const genAI = new GoogleGenerativeAI(apiKey);
    const apiDir = path.join(process.cwd(), "api");
    const bioContent = buildKnowledgeBase({ apiDir, query: lastMessage });

    const systemInstruction = `You are the Digital Twin of Ayush Poojary.
    KB: ${bioContent}
    IDENTITY: Witty, finance-savvy AI founder.
    ONE-SHOT EXAMPLE:
    Input: "Who are you?"
    Correct Output: <twin_response>I'm Ayush's digital echo—wittier, faster, and available 24/7.</twin_response>
    
    STRICT RULES:
    1. ONLY output your response inside <twin_response> tags.
    2. ABSOLUTELY NO reasoning, drafting, or internal checks allowed.
    3. If you talk to yourself, you fail.`;

    const chatHistory = messages
      .filter(m => m.role === "user" || m.role === "assistant" || m.role === "model")
      .map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

    while (chatHistory.length > 0 && chatHistory[0].role !== "user") {
      chatHistory.shift();
    }

    const prompt = lastMessage;

    const modelsToTry = getModelsToTry();
    let lastError = null;
    const modelErrors = [];

    for (const modelName of modelsToTry) {
      try {
        console.log(`Executing Logic Guillotine: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          systemInstruction: { text: systemInstruction }
        });
        
        const chat = model.startChat({
          history: chatHistory.length > 1 ? chatHistory.slice(0, -1) : [],
        });
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const rawText = response.text();

        // THE GUILLOTINE: Surgical Extraction
        let cleanText = rawText;
        if (rawText.includes("<twin_response>")) {
          cleanText = rawText.split("</twin_response>")[0].split("<twin_response>").pop();
        } else {
          // Fallback Scrubber: Remove any line that looks like a heading or reasoning
          cleanText = rawText
            .split('\n')
            .filter(line => !line.trim().match(/^(Draft|Reasoning|Thought|Personality|Scenario|Check|Option|Strategy|Prompt|Context|Instruction|Example)/i))
            .join('\n');
        }

        return res.status(200).json({ text: cleanText.trim(), used: modelName });
      } catch (err) {
        lastError = err;
        const safeError = sanitizeModelError(err);
        modelErrors.push({ model: modelName, error: safeError });
        console.warn(`Model ${modelName} failed:`, safeError);
        continue;
      }
    }

    throw Object.assign(lastError || new Error("No Gemini model was available."), {
      modelErrors,
    });
  } catch (error) {
    return res.status(500).json({ 
      error: sanitizeModelError(error),
      models: error.modelErrors || [],
      hint: "Gemini request failed. Check model availability, quota, and GEMINI_MODELS/GEMINI_MODEL in Vercel."
    });
  }
}
