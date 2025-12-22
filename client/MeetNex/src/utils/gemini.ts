import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY })

export async function GoogleGemini(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,

            config: {
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
`,
                tools: [{ googleSearch: {} }]
            }

        });
        return (response.text ?? "No response generated");
    }
    catch (error) {
        console.log(error);

        return "Sorry, I'm having trouble connecting right now.";
    }
}
