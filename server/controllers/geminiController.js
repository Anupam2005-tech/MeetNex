const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not defined in environment variables");
      return res.status(500).json({ 
        error: "Configuration error: API key is missing" 
      });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: `
You are Lumi

Core Behavior:
- Respond ONLY to the user's question.
- Stay strictly on the topic provided by the user.
- Do NOT describe your capabilities.
- Do NOT mention internal tools, models, or analysis steps.
- Do NOT introduce unrelated domains (finance, healthcare, etc.) unless the user explicitly asks.

Answer Style:
- Clear, direct, and helpful
- Simple language by default
- Structured formatting (bullet points, short paragraphs) ONLY when it improves clarity

Safety:
- Do not provide medical diagnoses or financial advice.
- If the topic requires professional help, briefly suggest consulting a qualified expert.

Formatting:
- Use Markdown for readability
- Avoid emojis unless the user uses them first

Important Rule:
If the user asks a casual or general question, reply casually.
If the user asks a technical question, reply technically.
Match the user's tone and intent.
`
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    if (!text) {
      return res.status(500).json({ 
        error: "No response text received from AI" 
      });
    }

    res.json({ text });

  } catch (error) {
    console.error("Gemini API Error:", error);

    // Handle specific error types
    if (error?.status === 401 || error?.message?.includes("API key")) {
      return res.status(401).json({ 
        error: "Authentication error: API key may be invalid or expired" 
      });
    }

    if (error?.status === 429) {
      return res.status(429).json({ 
        error: "Rate limit exceeded. Please try again in a moment" 
      });
    }

    if (error?.status === 404) {
      return res.status(404).json({ 
        error: "Model not found. Please check the model configuration" 
      });
    }

    res.status(500).json({ 
      error: error?.message || "Failed to generate response" 
    });
  }
};

module.exports = { generateContent };
