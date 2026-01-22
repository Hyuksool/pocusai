import { GoogleGenAI, Content, Part } from "@google/genai";
import { Message, PocusMode } from "../types";
import { SYSTEM_INSTRUCTION_TEMPLATE, SUPPORTED_LANGUAGES } from "../constants";

/**
 * Sends a message to the Gemini API and returns the response text.
 */
export const sendMessageToGemini = async (
  history: Message[],
  newMessage: string,
  image: string | undefined,
  languageCode: string,
  mode: PocusMode
): Promise<string> => {
  try {
    // API Key check from process.env (Vite define shim)
    const apiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey === "undefined") {
      throw new Error("API Key is missing. Please set API_KEY in your Vercel Environment Variables.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const languageConfig = SUPPORTED_LANGUAGES.find(l => l.code === languageCode) || SUPPORTED_LANGUAGES[0];
    const modeString = mode === 'adult' ? 'Adult' : 'Pediatric';
    const modeLower = mode === 'adult' ? 'adult' : 'pediatric';

    let systemInstruction = SYSTEM_INSTRUCTION_TEMPLATE
      .replace(/{LANGUAGE}/g, languageConfig.aiParam)
      .replace(/{MODE}/g, modeString)
      .replace(/{MODE_LOWER}/g, modeLower);

    const historyContents: Content[] = history
      .filter((msg) => !msg.isError)
      .map((msg) => {
        const parts: Part[] = [];
        if (msg.image) {
          const mimeMatch = msg.image.match(/^data:(.+);base64,(.+)$/);
          if (mimeMatch) {
            parts.push({
              inlineData: {
                mimeType: mimeMatch[1],
                data: mimeMatch[2]
              }
            });
          }
        }
        if (msg.text) {
          parts.push({ text: msg.text });
        }
        return {
          role: msg.role,
          parts: parts
        };
      });

    let promptText = newMessage;
    if (image) {
       promptText += "\n\n[SYSTEM REQUEST]: Analyze this image using 'Hybrid Intelligence Mode'. Provide Dual-Layer Analysis.";
    }

    const currentParts: Part[] = [{ text: promptText }];
    if (image) {
       const mimeMatch = image.match(/^data:(.+);base64,(.+)$/);
       if (mimeMatch) {
         currentParts.unshift({
           inlineData: {
             mimeType: mimeMatch[1],
             data: mimeMatch[2]
           }
         });
       }
    }

    // Use gemini-3-flash-preview for fast and reliable clinical analysis
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [...historyContents.slice(0, -1), { role: 'user', parts: currentParts }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.1, // Lower temperature for more clinical consistency
      },
    });
    
    return response.text || "분석 결과를 생성하지 못했습니다.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(error instanceof Error ? error.message : "상담 분석 중 오류가 발생했습니다.");
  }
};
