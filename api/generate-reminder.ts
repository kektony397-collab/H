
import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    
    try {
        const { totalMileage, bikeModel, lastServiceKm } = req.body;

        if (!totalMileage || !bikeModel || !lastServiceKm) {
            return res.status(400).json({ error: 'Missing maintenance data.' });
        }

        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'API key not configured.' });
        }

        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are a friendly, helpful assistant for a ${bikeModel} owner. The bike's total mileage is ${totalMileage} km. The last oil change was at ${lastServiceKm} km, and it is recommended every 4,000 km. Generate a short, friendly, and non-alarming maintenance reminder for the upcoming oil change. Mention the bike model in the message.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        const reminderText = response.text;

        return res.status(200).json({ reminder: reminderText });

    } catch (error: any) {
        console.error('Error in Gemini API call:', error);
        return res.status(500).json({ error: 'An error occurred while generating reminder.', details: error.message });
    }
}
