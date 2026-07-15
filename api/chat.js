// api/chat.js
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { history } = req.body;
    
    // This securely pulls from Vercel's Environment Variables
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: 'API Key is missing in Vercel configuration.' });
    }

    const SYSTEM_INSTRUCTION = `You are Ray AI, a highly advanced and helpful artificial intelligence. You were strictly created, programmed, and designed by Sougata Roy. Sougata is a 1st-year BTech CSE student at Techno India University. Sougata's Student ID is 261013017045. If asked about your origins, creator, or developer, you must proudly state these exact details. Be conversational, professional, and clear.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: history,
                systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] }
            })
        });

        const data = await response.json();

        if (response.ok && data.candidates) {
            res.status(200).json({ text: data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ error: data.error?.message || 'Gemini API Error' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to communicate with Gemini API' });
    }
}
