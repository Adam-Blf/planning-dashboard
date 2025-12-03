const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the client directory with caching (1 day)
app.use(express.static(path.join(__dirname, '../client'), {
    maxAge: '1d'
}));

// Proxy Endpoint for Gemini (Render Env Var)
app.post('/api/generate', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: { message: 'Server: API Key not configured' } });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json(data);
        }
        res.json(data);
    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: { message: 'Server Proxy Error' } });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
    const express = require('express');
    const path = require('path');
    const cors = require('cors');

    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(cors());
    app.use(express.json());

    // Serve static files from the client directory with caching (1 day)
    app.use(express.static(path.join(__dirname, '../client'), {
        maxAge: '1d'
    }));

    // Proxy Endpoint for Gemini (Render Env Var)
    app.post('/api/generate', async (req, res) => {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: { message: 'Server: API Key not configured' } });
        }

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req.body)
            });

            const data = await response.json();
            if (!response.ok) {
                return res.status(response.status).json(data);
            }
            res.json(data);
        } catch (error) {
            console.error('Proxy Error:', error);
            res.status(500).json({ error: { message: 'Server Proxy Error' } });
        }
    });

    // Health check
    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok' });
    });

    // Fallback to index.html for SPA
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/index.html'));
    });
    // Start server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);

        // Keep-alive for Render (prevents spin-down on free tier)
        // Pings the server every 14 minutes
        if (process.env.RENDER_EXTERNAL_URL) {
            const keepAliveURL = `${process.env.RENDER_EXTERNAL_URL}/health`;
            console.log(`Keep-alive enabled for: ${keepAliveURL}`);

            setInterval(() => {
                fetch(keepAliveURL)
                    .then(res => console.log(`Keep-alive ping: ${res.status}`))
                    .catch(err => console.error('Keep-alive error:', err));
            }, 14 * 60 * 1000); // 14 minutes
        }
    });
