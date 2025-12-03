export class GeminiService {
    static async generate(prompt, apiKey) {
        if (!apiKey) throw new Error("Clé API manquante");

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'Erreur API Gemini');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
}
