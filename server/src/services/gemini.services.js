import { GoogleGenAI } from "@google/genai";
import { prompt } from "../utils/prompt.js";
import { ENV } from "../config/ENV.js";

const ai = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });

/**
 * Enhanced AI model - returns AI response directly
 */
export async function AiModel({ topic, difficulty }) {

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt({ topic, difficulty }),
      config: {
        responseMimeType: "text/plain",
      },
    });

    const content = response.text;
    if (content && content.length > 50) {
      return content;
    }
    return null;
  } catch (error) {
    console.error("AI Generation error:", error.message);
    return null;
  }
}
