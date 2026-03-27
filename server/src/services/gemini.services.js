import { GoogleGenAI } from "@google/genai";
import { prompt } from "../utils/prompt.js";
import { quizPrompt } from "../utils/quizPrompt.js";
import { ENV } from "../config/ENV.js";

const ai = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });

/**
 * Single function for notes and quiz generation
 * If topic & difficulty provided → generate notes 
 * If only content provided → generate quiz only
 */
export async function CombinedAiModel({ topic, difficulty, content }) {
  try {
    let notesContent = null;
    let quizContent = null;

    // Generate notes if topic and difficulty provided
    if (topic && difficulty) {
      const notesResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt({ topic, difficulty }),
        config: { responseMimeType: "text/plain" },
      });
      notesContent = notesResponse.text;
    }
    // Generate quiz only if content provided
    else if (content) {
      const quizResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: quizPrompt({ generatedContent: content }),
        config: { responseMimeType: "text/plain" },
      });
      quizContent = quizResponse.text;
    }

    return {
      notes: notesContent,
      quiz: quizContent
    };
  } catch (error) {
    console.error("AI Generation error:", error.message);
    return null;
  }
} 