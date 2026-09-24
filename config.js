// Configuration for whodis.gg
// This file is loaded by index.html. Do NOT commit your real API key here.
// config.js is gitignored (see .gitignore).

const CONFIG = {
    // Backend server URL (where the Riot API proxy runs)
    // Default: http://localhost:3001
    // In production, set this to your deployed backend URL
    BACKEND_URL: 'http://localhost:3001',

    // Match history count to fetch (max 100 per request)
    MATCH_HISTORY_COUNT: 100,

    // Regions mapping (Riot platform code → api routing region)
    REGIONS: {
        NA1: { name: 'North America', apiRegion: 'americas' },
        EUW1: { name: 'Western Europe', apiRegion: 'europe' },
        EUN1: { name: 'Europe Nordic & East', apiRegion: 'europe' },
        KR: { name: 'Korea', apiRegion: 'asia' },
        BR1: { name: 'Brazil', apiRegion: 'americas' },
        LA1: { name: 'Latin America North', apiRegion: 'americas' },
        LA2: { name: 'Latin America South', apiRegion: 'americas' },
        OC1: { name: 'Oceania', apiRegion: 'americas' },

        TR1: { name: 'Turkey', apiRegion: 'europe' },
        RU: { name: 'Russia', apiRegion: 'europe' },
        SG2: { name: 'Singapore', apiRegion: 'sea' },
        PH2: { name: 'Philippines', apiRegion: 'sea' },
        TH2: { name: 'Thailand', apiRegion: 'sea' },
        TW2: { name: 'Taiwan', apiRegion: 'sea' },
        VN2: { name: 'Vietnam', apiRegion: 'sea' },
        JP1: { name: 'Japan', apiRegion: 'asia' },
    },

    // Display settings
    DISPLAY: {
        maxSharedGames: 20,
    },
};

// Browser compatibility - expose CONFIG globally
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

if (typeof module !== 'undefined') {
    module.exports = CONFIG;
}