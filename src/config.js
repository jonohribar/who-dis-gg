// Configuration for whodis.gg

const CONFIG = {
    // Riot Games API base URLs
    RIOT_API_BASE: 'https://americas.api.riotgames.com',

    // Your Riot Developer API key (free tier)
    // For production use, move this to environment variables
    API_KEY: 'YOUR_RIOT_API_KEY_HERE',

    // Rate limiting (Riot allows 20 requests/second)
    RATE_LIMIT: {
        perSecond: 20,
        maxRequests: 20,
    },

    // Match history count to fetch (max 100 per request)
    MATCH_HISTORY_COUNT: 100,

    // Regions mapping
    REGIONS: {
        NA1: { name: 'North America', apiRegion: 'americas' },
        EUW1: { name: 'Western Europe', apiRegion: 'europe' },
        EUW: { name: 'Western Europe', apiRegion: 'europe' },
        KR: { name: 'Korea', apiRegion: 'asia' },
        BR1: { name: 'Brazil', apiRegion: 'americas' },
        LA1: { name: 'Latin America', apiRegion: 'americas' },
        LA2: { name: 'Latin America', apiRegion: 'americas' },
    },

    // Cache duration (5 minutes)
    CACHE_DURATION: 5 * 60 * 1000,

    // Display settings
    DISPLAY: {
        maxSharedGames: 20,
        showRankedOnly: false,
    },
};

module.exports = CONFIG;