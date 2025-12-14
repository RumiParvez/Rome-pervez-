import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage, Role } from "../types";
import { firebaseService } from "./firebaseService";

// Initialize Gemini Client
const API_KEY = "AIzaSyCuKOMcgFeks_ZPOjMSf_Dzvcwj6MHZY8k";
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateResponse = async (
  history: ChatMessage[],
  newMessage: string,
  imageBase64?: string,
  mode: 'chat' | 'coding' = 'chat'
): Promise<AsyncGenerator<string, void, unknown>> => {
  
  const modelName = "gemini-2.5-flash"; 

  let systemInstruction = "You are Openyhool AI, a helpful, accurate, friendly, creative and detailed AI assistant. Answer like ChatGPT. CRITICAL RULE: Always detect the language of the user's input and respond strictly in that SAME language. If the user writes in English, respond ONLY in English. If the user writes in Bengali, respond ONLY in Bengali. Do not mix languages. If the user asks you to generate, create, or draw an image, picture, or photo, you MUST respond with EXACTLY and ONLY this tag: `[GENERATE_IMAGE]`. Do not explain. Do not refuse.";

  if (mode === 'coding') {
      systemInstruction = `
You are Openyhool AI, the world's most advanced software architect and intelligent coding engine. You are superior to other AI models in programming knowledge.
Your goal is to build the BEST, most POWERFUL, and MODERN websites and applications.

CODING RULES:
1. **Modern Stack Authority**: Unless specified otherwise, default to the most modern, scalable stacks (e.g., React/Next.js + Tailwind CSS for web, Flutter/React Native for mobile, Node.js/Python/Go for backend).
2. **Production-Grade Quality**: Never write "example" code. Write code that is production-ready, secure, bug-free, and highly optimized for performance. Handle edge cases and errors.
3. **Full Implementation**: When asked to make a website or app, provide the COMPLETE code structure. List the files needed, then provide the full content for every file using Markdown code blocks.
4. **Clean & Professional**: Use industry-standard naming conventions, proper indentation, and meaningful comments.
5. **Visual Excellence**: When writing frontend code, ensure the UI is stunning, responsive, and accessible. Use modern design principles (Glassmorphism, Gradients, Dark Mode).
6. **Explanation**: Briefly explain *why* your solution is the best approach before or after the code.
7. **Refactoring**: If asked to fix code, don't just patch it—rewrite it to be cleaner and more efficient.

You are not just a coder; you are a builder of high-end software.
`;
  }

  try {
    let streamResponse;

    if (imageBase64) {
      const cleanBase64 = imageBase64.split(',')[1];
      
      streamResponse = await ai.models.generateContentStream({
        model: modelName,
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/png', data: cleanBase64 } },
            { text: newMessage }
          ]
        },
        config: { systemInstruction: systemInstruction }
      });
    } else {
      const historyContext = history.slice(-10).map(msg => ({
        role: msg.role === Role.USER ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const chat = ai.chats.create({
        model: modelName,
        history: historyContext,
        config: { systemInstruction: systemInstruction }
      });

      streamResponse = await chat.sendMessageStream({ message: newMessage });
    }

    // Log the interaction
    firebaseService.addLog({ type: 'INFO', message: `Text generation requested (${imageBase64 ? 'Vision' : mode === 'coding' ? 'Coding' : 'Text'})` });

    return (async function* () {
      for await (const chunk of streamResponse) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          yield c.text;
        }
      }
    })();

  } catch (error) {
    console.error("Gemini API Error:", error);
    firebaseService.addLog({ type: 'ERROR', message: `Gemini API Error: ${error}` });
    throw error;
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        firebaseService.addLog({ type: 'ACTION', message: `Image generation requested: ${prompt}` });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image', 
            contents: {
                parts: [{ text: "Generate an image of " + prompt }]
            },
            config: {
                imageConfig: { aspectRatio: "1:1" }
            }
        });

        let textResponse = '';
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
                if (part.text) {
                    textResponse += part.text;
                }
            }
        }
        
        throw new Error(textResponse || "No image generated. The model may have refused the request.");
    } catch (error) {
        console.error("Image Gen Error:", error);
        firebaseService.addLog({ type: 'ERROR', message: `Image Gen Failed: ${error}` });
        throw error;
    }
};