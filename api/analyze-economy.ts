
import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { refuelRecords, tripLogs } = req.body;

        if (!refuelRecords || !tripLogs) {
            return res.status(400).json({ error: 'Missing historical data.' });
        }

        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'API key not configured.' });
        }

        const ai = new GoogleGenAI({ apiKey });
        
        const prompt = `Act as a data analyst for a motorcycle rider. Analyze the following JSON data of refuel records and trip logs. Identify trends in the rider's fuel economy (km/l). Correlate fuel economy with trip characteristics (e.g., distance, implied speed). Provide a concise summary and three actionable, personalized tips for improving fuel efficiency. Data: ${JSON.stringify({ refuelRecords, tripLogs })}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const analysisText = response.text;

        return res.status(200).json({ analysis: analysisText });

    } catch (error: any) {
        console.error('Error in Gemini API call:', error);
        return res.status(500).json({ error: 'An error occurred while generating analysis.', details: error.message });
    }
}
