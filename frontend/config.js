// Configuration for whodis.gg
// This file is loaded by index.html. Do NOT commit your real API key here.
// Copy config.example.js to config.js and edit the API_KEY value.
// config.js is gitignored (see .gitignore).

const CONFIG = {
    // Riot Games API base URLs
    RIOT_API_BASE: 'https://americas.api.riotgames.com',

    // Your Riot Developer API key (free tier)
    // Get one at https://developer.riotgames.com/
    // Replace 'YOUR_RIOT_API_KEY_HERE' with your actual key.
    API_KEY: 'YOUR_RIOT_API_KEY_HERE',

    // Rate limiting (Riot allows 20 requests/second)
    RATE_LIMIT: {
        perSecond: 20,
        maxRequests: 20,
    },

    // Match history count to fetch (max 100 per request)
    MATCH_HISTORY_COUNT: 100,

    // Regions mapping (Riot platform code → api routing region)
    REGIONS: {
        NA1: { name: 'North America', apiRegion: 'americas' },
        EUW1: { name: 'Western Europe', apiRegion: 'europe' },
        EUW: { name: 'Western Europe', apiRegion: 'europe' },
        KR: { name: 'Korea', apiRegion: 'asia' },
        BR1: { name: 'Brazil', apiRegion: 'americas' },
        LA1: { name: 'Latin America', apiRegion: 'americas' },
        LA2: { name: 'Latin America', apiRegion: 'americas' },
        OC1: { name: 'Oceania', apiRegion: 'americas' },
        OC: { name: 'Oceania', apiRegion: 'americas' },
        TR1: { name: 'Turkey', apiRegion: 'europe' },
        RU: { name: 'Russia', apiRegion: 'europe' },
        SG: { name: 'Singapore', apiRegion: 'sea' },
        PH: { name: 'Philippines', apiRegion: 'sea' },
        TH: { name: 'Thailand', apiRegion: 'sea' },
        TW: { name: 'Taiwan', apiRegion: 'sea' },
        JP: { name: 'Japan', apiRegion: 'asia' },
        VN: { name: 'Vietnam', apiRegion: 'sea' },
    },

    // Cache duration (5 minutes)
    CACHE_DURATION: 5 * 60 * 1000,

    // Display settings
    DISPLAY: {
        maxSharedGames: 20,
        showRankedOnly: false,
    },
};

// Browser compatibility - expose CONFIG globally
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

if (typeof module !== 'undefined') {
    module.exports = CONFIG;
}