/**
 * Backend server for whodis.gg
 * Proxies Riot API requests to avoid exposing API key in browser.
 * Reads RIOT_API_KEY from environment variable.
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - allow frontend origin
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    credentials: false
}));

// Parse JSON bodies
app.use(express.json());

// Rate limiting (simple in-memory, per IP)
const requestCounts = new Map();
const RATE_LIMIT_WINDOW_MS = 1000; // 1 second
const RATE_LIMIT_MAX = 20; // 20 requests per second per IP

function rateLimitMiddleware(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    
    if (!requestCounts.has(ip)) {
        requestCounts.set(ip, []);
    }
    
    const timestamps = requestCounts.get(ip).filter(ts => ts > windowStart);
    
    if (timestamps.length >= RATE_LIMIT_MAX) {
        return res.status(429).json({ 
            error: 'Rate limit exceeded', 
            retryAfter: Math.ceil((timestamps[0] + RATE_LIMIT_WINDOW_MS - now) / 1000)
        });
    }
    
    timestamps.push(now);
    requestCounts.set(ip, timestamps);
    next();
}

// Apply rate limiting to all proxy routes
app.use('/api/riot', rateLimitMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Riot API proxy endpoint
// Expected path: /api/riot/<region>/<endpoint>
// Example: /api/riot/americas/riot/account/v1/accounts/by-riot-id/Faker/NA1
app.get('/api/riot/:region/*', async (req, res) => {
    try {
        const apiKey = process.env.RIOT_API_KEY;
        if (!apiKey) {
            console.error('RIOT_API_KEY not configured');
            return res.status(500).json({ error: 'Server configuration error' });
        }
        
        const region = req.params.region;
        const endpoint = req.params[0]; // the rest of the path
        const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
        
        // Validate region
        const validRegions = ['americas', 'europe', 'asia', 'sea'];
        if (!validRegions.includes(region)) {
            return res.status(400).json({ error: `Invalid region: ${region}` });
        }
        
        const riotUrl = `https://${region}.api.riotgames.com/${endpoint}${queryString}`;
        
        console.log(`Proxying: ${region} ${endpoint}`);
        
        const response = await fetch(riotUrl, {
            headers: {
                'X-Riot-Token': apiKey,
                'Accept': 'application/json'
            }
        });
        
        const data = await response.text();
        
        // Forward response with same status
        res.status(response.status);
        res.set('Content-Type', 'application/json');
        res.send(data);
        
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Also support POST for endpoints that require it (though Riot API is mostly GET)
app.post('/api/riot/:region/*', async (req, res) => {
    try {
        const apiKey = process.env.RIOT_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Server configuration error' });
        }
        
        const region = req.params.region;
        const endpoint = req.params[0];
        const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
        
        const validRegions = ['americas', 'europe', 'asia', 'sea'];
        if (!validRegions.includes(region)) {
            return res.status(400).json({ error: `Invalid region: ${region}` });
        }
        
        const riotUrl = `https://${region}.api.riotgames.com/${endpoint}${queryString}`;
        
        const response = await fetch(riotUrl, {
            method: 'POST',
            headers: {
                'X-Riot-Token': apiKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });
        
        const data = await response.text();
        res.status(response.status);
        res.set('Content-Type', 'application/json');
        res.send(data);
        
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`whodis.gg backend listening on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Riot API proxy: http://localhost:${PORT}/api/riot/<region>/<endpoint>`);
});

module.exports = app;