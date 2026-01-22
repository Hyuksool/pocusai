import { GoogleGenAI, Content, Part } from "@google/genai";
import { Message, PocusMode } from "../types";
import { SYSTEM_INSTRUCTION_TEMPLATE, SUPPORTED_LANGUAGES } from "../constants";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
        
        // Add text part (even if empty, though usually it won't be)
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
       // Append specific instruction to trigger the dual analysis defined in system prompt
       promptText += "\n\n[SYSTEM REQUEST]: Analyze this image using the 'Hybrid Intelligence Mode'. Perform the Dual-Layer Analysis (Clinical Interpretation vs. AI Morphological Feature Extraction) as defined in your instructions. Compare these to provide the most accurate result.";
    }

    const currentParts: Part[] = [{ text: promptText }];
    
    if (image) {
       const mimeMatch = image.match(/^data:(.+);base64,(.+)$/);
       if (mimeMatch) {
         // Prepend image to the current prompt
         currentParts.unshift({
           inlineData: {
             mimeType: mimeMatch[1],
             data: mimeMatch[2]
           }
         });
       }
    }

    // Filter out the very last message which is the current user message we just added in App.tsx
    const chatHistory = historyContents.slice(0, -1);

    const chat = ai.chats.create({
      model: "gemini-3-pro-preview", // Supports multimodal input
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2, // Low temperature for factual medical advice
      },
      history: chatHistory,
    });

    const result = await chat.sendMessage({ 
      message: currentParts
    });
    
    return result.text || "No response generated.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Sorry, an error occurred while analyzing the image/request. Please try again.");
  }
};