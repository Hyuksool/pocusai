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
    // API Key from process.env (injected by Vite define)
    const apiKey = process.env.API_KEY;
    
    // Detailed check for API Key availability
    if (!apiKey || apiKey === "undefined" || apiKey === "") {
      throw new Error("API_KEY가 감지되지 않았습니다. [해결 방법]: 1. Vercel Settings > Environment Variables에 API_KEY가 등록되어 있는지 확인하세요. 2. 변수 추가/수정 후 반드시 'Deployments' 탭에서 최신 커밋을 'Redeploy' 해야 변경 사항이 반영됩니다.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const languageConfig = SUPPORTED_LANGUAGES.find(l => l.code === languageCode) || SUPPORTED_LANGUAGES[0];
    const modeString = mode === 'adult' ? 'Adult' : 'Pediatric';

    let systemInstruction = SYSTEM_INSTRUCTION_TEMPLATE
      .replace(/{LANGUAGE}/g, languageConfig.aiParam)
      .replace(/{MODE}/g, modeString);

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
       promptText += "\n\n[SYSTEM REQUEST]: Analyze this image using 'Hybrid Intelligence Mode'. Provide Dual-Layer Analysis including specific sonographic features.";
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

    // Use gemini-3-flash-preview for high-performance clinical reasoning
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [...historyContents.slice(0, -1), { role: 'user', parts: currentParts }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.1,
      },
    });
    
    return response.text || "분석 결과를 생성하지 못했습니다.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(error instanceof Error ? error.message : "상담 분석 중 오류가 발생했습니다.");
  }
};
