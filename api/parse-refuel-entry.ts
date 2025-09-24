
import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { userInput } = req.body;

        if (!userInput || typeof userInput !== 'string') {
            return res.status(400).json({ error: 'Invalid user input provided.' });
        }

        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'API key not configured.' });
        }

        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are an intelligent assistant for a motorcycle dashboard. Your task is to parse the user's input and extract the amount of fuel added. The bike's tank capacity is 8 liters. If the user indicates they 'filled up', use the tank capacity. User input: '${userInput}'`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        litersAdded: {
                            type: Type.NUMBER,
                            description: "The amount of fuel added in liters. If the user says they 'filled up', this should be 8.0.",
                        },
                    },
                    required: ["litersAdded"]
                },
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        if (parsedJson && typeof parsedJson.litersAdded === 'number') {
            return res.status(200).json({ litersAdded: parsedJson.litersAdded });
        } else {
            return res.status(500).json({ error: 'AI failed to return a valid number.' });
        }

    } catch (error: any) {
        console.error('Error in Gemini API call:', error);
        return res.status(500).json({ error: 'An error occurred while processing your request.', details: error.message });
    }
}
