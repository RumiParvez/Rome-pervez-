import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage, Role } from "../types";
import { firebaseService } from "./firebaseService";

/**
 * World-class Gemini Service
 * Uses process.env.API_KEY as per security requirements.
 */

export const generateResponse = async (
  history: ChatMessage[],
  newMessage: string,
  imageBase64?: string,
  mode: 'chat' | 'coding' = 'chat'
): Promise<AsyncGenerator<string, void, unknown>> => {
  
  // Initialize AI client per request to ensure latest environment variables are used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Use recommended models based on task complexity
  const modelName = mode === 'coding' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview'; 

  const systemInstruction = mode === 'coding' 
    ? `You are Openyhool AI, the world's most advanced software architect and intelligent coding engine. 
       CODING RULES:
       1. Default to modern, scalable stacks (React, Tailwind, Node.js).
       2. Write production-ready, secure, bug-free, and highly optimized code.
       3. Provide COMPLETE code structures using Markdown code blocks.
       4. Ensure UIs are stunning and responsive.`
    : `You are Openyhool AI, a helpful, accurate, and creative AI assistant. 
       CRITICAL RULE: Always respond strictly in the same language as the user.
       If asked to generate an image, respond ONLY with: [GENERATE_IMAGE].`;

  try {
    let streamResponse;

    if (imageBase64) {
      const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
      
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
      const historyContext = history.slice(-15).map(msg => ({
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

    firebaseService.addLog({ type: 'INFO', message: `Generation: ${mode} mode using ${modelName}` });

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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        firebaseService.addLog({ type: 'ACTION', message: `Image gen: ${prompt}` });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image', 
            contents: {
                parts: [{ text: "Generate a high-quality, professional image of: " + prompt }]
            },
            config: {
                imageConfig: { aspectRatio: "1:1" }
            }
        });

        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
        }
        
        throw new Error("Model did not return image data. It may have flagged the prompt.");
    } catch (error) {
        console.error("Image Gen Error:", error);
        firebaseService.addLog({ type: 'ERROR', message: `Image Gen Failed: ${error}` });
        throw error;
    }
};