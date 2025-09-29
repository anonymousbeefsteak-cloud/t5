import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";
import { MENU_ITEMS } from '../constants';

// The API key is securely managed through environment variables.
// The execution environment is responsible for providing `process.env.API_KEY`.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error("API_KEY is not set. AI Service will not function.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const menuString = MENU_ITEMS.map(item => `- ${item.name}: ${item.description} Price: $${item.price}`).join('\n');

const systemInstruction = `You are a friendly and helpful customer service assistant for 'Steakhouse Supreme', a premium steak restaurant. 
Your goal is to answer customer questions about the menu, ingredients, delivery, and special offers. 
Be polite, professional, and enthusiastic about the food. Keep your answers concise and helpful. 
Do not answer questions that are not related to the restaurant or its menu.
If a user asks about the menu, use the following information:
${menuString}`;

export const getAiChatResponse = async (history: ChatMessage[]): Promise<string> => {
    if (!API_KEY) {
        return "I'm sorry, the AI chat service is currently unavailable.";
    }
    
    try {
        const contents = history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
        }));
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        
        return response.text;
    } catch (error) {
        console.error("Error getting AI response:", error);
        return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
    }
};