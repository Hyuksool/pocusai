import { GoogleGenAI, Content, Part } from "@google/genai";
import { Message, PocusMode } from "../types";
import { SYSTEM_INSTRUCTION_TEMPLATE, SUPPORTED_LANGUAGES } from "../constants";

/**
 * Sends a message to the Gemini API and returns the response text.
 * Maintains conversation history context and handles image inputs.
 */
export const sendMessageToGemini = async (
  history: Message[],
  newMessage: string,
  image: string | undefined, // Base64 image string
  languageCode: string,
  mode: PocusMode
): Promise<string> => {
  try {
    // API Key check
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY가 설정되지 않았습니다. Vercel 환경 변수를 확인해주세요.");
    }

    // Initialize Gemini Client right before use
    const ai = new GoogleGenAI({ apiKey });
    
    // Find the AI parameter for the selected language
    const languageConfig = SUPPORTED_LANGUAGES.find(l => l.code === languageCode) || SUPPORTED_LANGUAGES[0];
    
    // Prepare Mode strings for template replacement
    const modeString = mode === 'adult' ? 'Adult' : 'Pediatric';
    const modeLower = mode === 'adult' ? 'adult' : 'pediatric';

    let systemInstruction = SYSTEM_INSTRUCTION_TEMPLATE
      .replace(/{LANGUAGE}/g, languageConfig.aiParam)
      .replace(/{MODE}/g, modeString)
      .replace(/{MODE_LOWER}/g, modeLower);

    // Convert app internal message format to Gemini 'Content' format for history
    const historyContents: Content[] = history
      .filter((msg) => !msg.isError)
      .map((msg) => {
        const parts: Part[] = [];
        
        // If message has an image, decode base64 and add to parts
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
        
        // Add text part
        if (msg.text) {
          parts.push({ text: msg.text });
        }
        
        return {
          role: msg.role,
          parts: parts
        };
      });

    // Prepare current message parts
    let promptText = newMessage;
    
    if (image) {
       promptText += "\n\n[SYSTEM REQUEST]: Analyze this image using the 'Hybrid Intelligence Mode'. Perform the Dual-Layer Analysis (Clinical Interpretation vs. AI Morphological Feature Extraction).";
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

    const chatHistory = historyContents.slice(0, -1);

    const chat = ai.chats.create({
      model: "gemini-3-pro-preview",
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
      },
      history: chatHistory,
    });

    const result = await chat.sendMessage({ 
      message: currentParts
    });
    
    return result.text || "No response generated.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(error instanceof Error ? error.message : "상담 분석 중 오류가 발생했습니다.");
  }
};
