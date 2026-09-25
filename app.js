/**
 * whodis.gg — Riot API Integration
 *
 * Finds shared League of Legends games between two summoners.
 *
 * Requirements:
 *   - frontend/config.js loaded first (sets window.CONFIG)
 *   - CORS proxy required for browser (Riot API blocks browser requests)
 *
 * Flow:
 *   1. Read summoner name + tagline for both players
   *   2. Resolve Riot ID → PUUID (account-v1)
   *   3. Fetch match lists for both PUUIDs (match-v5)
   *   4. Find shared match IDs (intersection)
   *   5. Fetch match details for each shared game (match-v5)
   *   6. Display results on the page
 */

// ─── Backend Configuration ──────────────────────────────────────────────────
// Backend server URL - set via config or defaults to localhost:3001
const BACKEND_URL = window.CONFIG?.BACKEND_URL || 'http://localhost:3001';

// ─── Rate Limiter ─────────────────────────────────────────────────────────────
// Client-side rate limiting as a safety net (backend also rate limits).
// Riot API allows 20 requests/second. Enforce minimum 50ms between requests AND no more than 20 requests in any rolling 1-second window.
const MIN_REQUEST_INTERVAL_MS = 50;
const MAX_REQUESTS_PER_SECOND = 20;
let _lastRequestTime = 0;
let _requestCountThisSecond = 0;
let _rateLimitMutex = Promise.resolve();

/**
 * Enforce minimum interval between Riot API requests.
 * Uses a mutex to prevent race conditions when multiple concurrent calls
 * would otherwise read the same _lastRequestTime.
 * Also caps requests at MAX_REQUESTS_PER_SECOND; if exceeded, waits until
 * the next second window.
 * @returns {Promise<void>}
 */
async function rateLimit() {
    // Chain onto the mutex promise to serialize all callers
    _rateLimitMutex = _rateLimitMutex.then(async () => {
        const now = Date.now();
        const elapsed = now - _lastRequestTime;

        // Reset counter if we're in a new second window
        if (now - _lastRequestTime >= 1000) {
            _requestCountThisSecond = 0;
        }

        // If we've hit the per-second cap, wait until the next second
        if (_requestCountThisSecond >= MAX_REQUESTS_PER_SECOND) {
            const waitMs = 1000 - (now % 1000);
            await new Promise(resolve => setTimeout(resolve, waitMs));
            _requestCountThisSecond = 0;
        }

        if (elapsed < MIN_REQUEST_INTERVAL_MS) {
            await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL_MS - elapsed));
        }
        _lastRequestTime = Date.now();
        _requestCountThisSecond++;
    });
    await _rateLimitMutex;
}

/**
 * Safely log errors without breaking the app if console is unavailable.
 * @param {...any} args
 */
function safeLog(...args) {
    try {
        if (typeof console === 'object' && typeof console.error === 'function') {
            console.error(...args);
        }
    } catch (_) {
        // Ignore logging failures
    }
}

/**
 * Escape HTML special characters to prevent XSS.
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
    if (typeof text !== 'string') {
        return text;
    }
    return text
        .replace(/&/g, '&')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/'/g, '&#039;');
}

// ─── Data Dragon Image Helpers ─────────────────────────────────────────
// Provides CDN URLs for champion/item/spell images from Riot Data Dragon.
// All URLs are publicly cacheable; no API key needed.
// Images are versioned – each patch has its own CDN branch (e.g. 14.12.1).
// If you fetch the latest version once and cache it, subsequent searches are fast.

// Maps numeric summoner spell IDs to their common names.
// Source: Riot API summoner spell IDs.
const SPELL_ID_MAP = {
    4: 'Flash',
    7: 'Heal',
    14: 'Ignite',
    30: 'Exhaust',
    35: 'Teleport',
    3: 'Barrier',
    21: 'Clarity',
    6: 'Cleanse',
    13: 'Move Quick',
    28: 'Mana Regeneration',
    31: 'Recall',
    40: 'Barrier',
    13: 'Move Quick',
};

/**
 * Convert a champion name to the format used in Data Dragon CDN URLs.
 * Removes spaces, punctuation, and any non‑alphanumeric characters.
 * @param {string} name - Champion name as returned by the Riot API (e.g. "Dr. Mundo")
 * @returns {string} CDN‑compatible name (e.g. "DrMundo")
 */
function toCdnName(name) {
    if (typeof name !== 'string') return '';
    return name.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Extract the Data Dragon version string from a game version (e.g. "14.12.1" → "14.12.1").
 * @param {string} gameVersion - The game version string from a match detail
 * @returns {string|null} Version string suitable for CDN URLs, or null if unparseable
 */
function getCdnVersion(gameVersion) {
    if (!gameVersion) return null;
    // gameVersion format is typically "14.12.1" or "14.12.1.1234"
    // We take the first three numeric components.
    const match = gameVersion.match(/^(\d+)\.(\d+)\.(\d+)/);
    if (match) return `${match[1]}.${match[2]}.${match[3]}`;
    // Fallback: try to extract any dotted version
    const fallback = gameVersion.match(/^(\d+(\.\d+){0,2})/);
    return fallback ? fallback[1] : null;
}

/**
 * Build a champion image URL from the Data Dragon CDN.
 * @param {string} championName - e.g. 'Tristana'
 * @param {string} version - Data Dragon version, e.g. '14.12.1'
 * @returns {string} Full CDN URL, or empty string if version is missing
 */
function getChampionImageUrl(championName, version) {
    if (!version || !championName) return '';
    const cdnName = toCdnName(championName);
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${cdnName}.png`;
}

/**
 * Get the name of a summoner spell from its numeric ID, then build a Data Dragon CDN URL.
 * @param {number} spellId - Numeric summoner spell ID (e.g. 4=Flash)
 * @param {string} version - Data Dragon version, e.g. '14.12.1'
 * @returns {string} Full CDN URL for the spell icon, or empty string if not found
 */
function getSpellImageUrl(spellId, version) {
    if (!version) return '';
    const spellName = SPELL_ID_MAP[spellId];
    if (!spellName) return '';
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/Summoner${spellName}.png`;
}

/**
 * Asynchronously fetch item data from Data Dragon for a given version, with version-based caching.
 * The cache is stored in a module-level Map; if the version is already cached, the Promise resolves immediately.
 * @param {string} version - Data Dragon version, e.g. '14.12.1'
 * @returns {Promise<Map<number, {name: string, imagePath: string}>>} Map of itemId → {name, imagePath}
 */
let itemDataCache = new Map();

async function getItemData(version) {
    if (!version) return new Map();
    // Return cached data if available
    if (itemDataCache.has(version)) return itemDataCache.get(version);
    // Fetch item JSON from Data Dragon
    try {
        const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/item.json`);
        if (!response.ok) throw new Error('Failed to fetch item data');
        const json = await response.json();
        const items = new Map();
        // json.data is an object where keys are item IDs as strings
        const itemEntries = json.data || {};
        for (const [key, value] of Object.entries(itemEntries)) {
            const id = parseInt(key, 10);
            if (!isNaN(id)) {
                const img = value.image?.full || '';
                items.set(id, {name: value.name || `Item ${id}`, imagePath: img});
            }
        }
        // Cache and return
        itemDataCache.set(version, items);
        return items;
    } catch (err) {
        console.warn('Failed to fetch item data from Data Dragon:', err);
        return new Map();
    }
}

/**
 * Asynchronously get the image URL for a specific item ID, using version-cached item data.
 * @param {number} itemId - The numeric item ID (e.g. 3115 for Runae's Hurricane)
 * @param {string} version - Data Dragon version, e.g. '14.12.1'
 * @returns {Promise<string>} Full CDN URL for the item icon, or empty string if not found
 */
async function getItemImageUrl(itemId, version) {
    if (!version) return Promise.resolve('');
    const data = await getItemData(version);
    const item = data.get(itemId);
    if (!item || !item.imagePath) return '';
    // The imagePath from Data Dragon is like "3115.png"; construct the full URL
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/${item.imagePath}`;
}

// ─── API Helpers ──────────────────────────────────────────────────────────────

/**
 * Build the backend proxy URL for a given Riot API endpoint.
 * @param {string} regionCode - Platform code, e.g. 'NA1' or 'OC1'
 * @param {string} endpoint - e.g. '/riot/account/v1/accounts/by-riot-id/Faker/NA1'
 * @returns {string} Backend proxy URL
 */
function riotUrl(regionCode, endpoint) {
    const regionConfig = window.CONFIG.REGIONS[regionCode];
    if (!regionConfig) {
        throw new Error(`Unknown region: ${regionCode}`);
    }
    // Smart routing: OCE (OC1) match-v5 needs sea shard; account-v1 stays americas
    if (regionCode === 'OC1' && endpoint.includes('/lol/match/v5/')) {
        return `${BACKEND_URL}/api/riot/sea${endpoint}`;
    }
    // Map platform code to routing region for backend
    const routingRegion = regionConfig.apiRegion;
    return `${BACKEND_URL}/api/riot/${routingRegion}${endpoint}`;
}

/**
 * Get the routing region (americas, europe, asia, sea) for a platform code.
 * @param {string} regionCode - Platform code, e.g. 'NA1'
 * @returns {string|null} Routing region or null if unknown
 */
function getRoutingRegion(regionCode) {
    const regionConfig = window.CONFIG.REGIONS[regionCode];
    return regionConfig ? regionConfig.apiRegion : null;
}

/**
 * Fetch from Riot API via local backend proxy.
 * Includes retry with exponential backoff for 429 responses.
 * @param {string} url - Backend proxy URL
 * @returns {Promise<object>} JSON response
 */
async function fetchRiot(url) {
    const maxRetries = 3;
    let attempt = 0;
    
    while (true) {
        await rateLimit();
        const response = await fetch(url);

        if (response.ok) {
            return response.json();
        }

        const errorBody = await response.text().catch(() => '');
        let errorMessage = `HTTP ${response.status}`;
        try {
            const json = JSON.parse(errorBody);
            errorMessage = json.error?.message || json.status?.message || errorMessage;
        } catch (_) {
            // use status text
        }

        // If 429 and we have retries left, wait with exponential backoff and retry
        if (response.status === 429 && attempt < maxRetries) {
            attempt++;
            const retryAfter = response.headers.get('Retry-After');
            let waitMs = 1000 * Math.pow(2, attempt - 1); // 1s, 2s, 4s
            if (retryAfter) {
                const retryAfterMs = parseInt(retryAfter, 10) * 1000;
                if (!isNaN(retryAfterMs)) {
                    waitMs = retryAfterMs;
                }
            }
            safeLog(`Rate limited (429), attempt ${attempt}/${maxRetries}, waiting ${waitMs}ms`);
            await new Promise(resolve => setTimeout(resolve, waitMs));
            continue;
        }

        throw new Error(errorMessage);
    }
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────

function setStatus(message) {
    const statusDiv = document.getElementById('status');
    if (statusDiv) statusDiv.textContent = message;
}

function showResults(html) {
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) resultsDiv.innerHTML = html;
}

/**
 * Safely set text content on an element.
 * @param {Element} parent
 * @param {string} selector
 * @param {string} text
 */
function setText(parent, selector, text) {
    const el = parent.querySelector(selector);
    if (el) el.textContent = text;
}

/**
 * Safely create an element with text content and optional attributes.
 * @param {string} tag
 * @param {string} text
 * @param {object} [attrs]
 * @returns {Element}
 */
function createElement(tag, text, attrs = {}) {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    return el;
}

function clearResults() {
    showResults('');
    setStatus('');
}

/**
 * Format a timestamp to a readable date string.
 * @param {number} timestamp - Unix timestamp in ms
 * @returns {string} Formatted date
 */
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Get the op.gg URL for a specific match.
 * @param {string} regionTag - e.g., 'NA1'
 * @param {string} matchId - e.g., 'NA1_abc123'
 * @returns {string} op.gg match URL
 */
function opggUrl(regionTag, matchId) {
    return `https://op.gg/lol/match-detail/match?matchId=${matchId}&region=${regionTag}`;
}

/**
 * Get the u.gg URL for a specific match.
 * @param {string} regionTag - e.g., 'NA1'
 * @param {string} matchId - e.g., 'NA1_abc123'
 * @returns {string} u.gg match URL
 */
function uggUrl(matchId) {
    return `https://u.gg/lol/match/${matchId}`;
}

// ─── Core Logic ───────────────────────────────────────────────────────────────

/**
 * Resolve a summoner name + tagline to PUUID.
 * @param {string} name - Summoner name
 * @param {string} tagline - Riot ID tagline (the part after #)
 * @param {string} regionCode - Platform code used for API routing
 * @returns {Promise<{puuid: string, name: string, tagline: string}>}
 */
async function resolveSummoner(name, tagline, regionCode) {
    const url = riotUrl(regionCode, `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tagline)}`);
    const data = await fetchRiot(url, 'resolveSummoner', regionCode);
    return {
        puuid: data.puuid,
        name: data.gameName,
        tagline: data.tagLine,
        region: regionCode,
    };
}

/**
 * Fetch match IDs for a PUUID.
 * @param {string} puuid - Encrypted PUUID
 * @param {string} regionCode - Platform code used for API routing
 * @returns {Promise<string[]>} Array of match IDs
 */
async function fetchMatchIds(puuid, regionCode) {
    const count = window.CONFIG?.MATCH_HISTORY_COUNT ?? 100;
    const url = riotUrl(regionCode, `/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`);
    const data = await fetchRiot(url, 'fetchMatchIds', regionCode);
    return data; // array of match ID strings
}

/**
 * Fetch match details for a match ID.
 * @param {string} matchId - Match ID
 * @param {string} regionCode - Platform code used for API routing
 * @returns {Promise<object>} Match detail object
 */
async function fetchMatchDetail(matchId, regionCode) {
    const url = riotUrl(regionCode, `/lol/match/v5/matches/${matchId}`);
    return await fetchRiot(url, 'fetchMatchDetail', regionCode);
}

/**
 * Extract relevant info from a match detail for display.
 * @param {object} match - Match detail from Riot API
 * @param {string} puuid - Our PUUID (to determine our team/role)
 * @returns {object} Simplified match info
 */
async function extractMatchInfo(match, puuid) {
    const info = match.info;
    const participants = info.participants || [];

    // Find our participant
    const ourParticipant = participants.find(p => p.puuid === puuid);
    const ourChampion = ourParticipant?.championName || 'Unknown';
    const ourKills = ourParticipant?.kills || 0;
    const ourDeaths = ourParticipant?.deaths || 0;
    const ourAssists = ourParticipant?.assists || 0;

    // Determine win/loss
    const weWon = ourParticipant?.win === true;

    // Extract all participants (champion picks)
    const allChampions = participants.map(p => ({
        name: p.summonerName || 'Unknown',
        champion: p.championName || 'Unknown',
        kills: p.kills || 0,
        deaths: p.deaths || 0,
        assists: p.assists || 0,
        team: p.teamId,
        puuid: p.puuid,
    }));

    // Match metadata
    const gameDuration = info.gameDuration || 0; // seconds
    const gameMode = info.gameMode || 'Unknown';
    const queueId = info.queueId || 0;
    const gameCreation = info.gameCreation || 0;

    // Build image URLs using Data Dragon CDN (version from match)
    const version = getCdnVersion(info.gameVersion);
    const championImageUrl = getChampionImageUrl(ourChampion, version);
    const summoner1ImageUrl = ourParticipant ? getSpellImageUrl(ourParticipant.summoner1Id, version) : '';
    const summoner2ImageUrl = ourParticipant ? getSpellImageUrl(ourParticipant.summoner2Id, version) : '';

    // Build item image URLs (async fetch via getItemImageUrl for each item slot)
    const itemImageUrls = [];
    if (ourParticipant && version) {
        for (let i = 0; i <= 6; i++) {
            const itemId = ourParticipant[`item${i}`];
            if (itemId && itemId > 0) {
                // Use fire-and-forget-like async; we await all together
                itemImageUrls.push(getItemImageUrl(itemId, version));
            } else {
                itemImageUrls.push(Promise.resolve(''));
            }
        }
    } else {
        for (let i = 0; i <= 6; i++) itemImageUrls.push(Promise.resolve(''));
    }
    const resolvedItemUrls = await Promise.all(itemImageUrls);

    return {
        matchId: match.metadata?.matchId || 'Unknown',
        date: formatDate(gameCreation),
        gameMode,
        queueId,
        gameDuration,
        weWon,
        ourChampion,
        ourKills,
        ourDeaths,
        ourAssists,
        allChampions,
        participantsCount: participants.length,
        championImageUrl,
        summoner1ImageUrl,
        summoner2ImageUrl,
        itemImageUrls: resolvedItemUrls,
        version,
    };
}

/**
 * Find shared games between two summoners.
 * @param {string} nameA - Player A summoner name
 * @param {string} taglineA - Player A Riot ID tagline
 * @param {string} regionA - Player A platform code
 * @param {string} nameB - Player B summoner name
 * @param {string} taglineB - Player B Riot ID tagline
 * @param {string} regionB - Player B platform code
 * @returns {Promise<{playerA: object, playerB: object, sharedMatches: array}>}
 */
async function findSharedGames(nameA, taglineA, regionA, nameB, taglineB, regionB, maxGames) {
    // Step 1: Resolve both summoners to PUUIDs
    setStatus('🔍 Resolving summoner A...');
    const playerA = await resolveSummoner(nameA, taglineA, regionA);

    setStatus('🔍 Resolving summoner B...');
    const playerB = await resolveSummoner(nameB, taglineB, regionB);

    // Step 2: Fetch match lists
    setStatus('📋 Fetching match history for Player A...');
    const matchesA = await fetchMatchIds(playerA.puuid, regionA);

    setStatus('📋 Fetching match history for Player B...');
    const matchesB = await fetchMatchIds(playerB.puuid, regionB);

    // Step 3: Find intersection (shared match IDs)
    const setB = new Set(matchesB);
    const sharedMatchIds = matchesA.filter(id => setB.has(id));

    if (sharedMatchIds.length === 0) {
        return { playerA, playerB, sharedMatches: [] };
    }

    // Step 4: Fetch details for shared matches (limit to avoid rate limits)
    const limit = maxGames || window.CONFIG.DISPLAY.maxSharedGames || 20;
    const matchesToFetch = sharedMatchIds.slice(0, limit);
    const sharedMatches = [];

    for (let i = 0; i < matchesToFetch.length; i++) {
        const matchId = matchesToFetch[i];
        setStatus(`Fetching match ${i + 1}/${matchesToFetch.length}...`);
        try {
            const matchDetail = await fetchMatchDetail(matchId, regionA);
            const info = await extractMatchInfo(matchDetail, playerA.puuid);
            sharedMatches.push(info);
        } catch (err) {
            // Skip failed match fetches
            safeLog(`Failed to fetch match ${matchId}:`, err.message);
        }
    }

    return { playerA, playerB, sharedMatches };
}

// ─── UI Rendering ─────────────────────────────────────────────────────────────

/**
 * Render the search results to the page.
 * @param {object} result - { playerA, playerB, sharedMatches }
 */
function renderResults(result) {
    const { playerA, playerB, sharedMatches } = result;

    if (sharedMatches.length === 0) {
        showResults(`
            <div class="bg-slate-950 border border-slate-700 rounded-xl p-6 shadow-md">
                <h3 class="text-lg font-bold text-slate-200 mb-2">No Shared Games Found</h3>
                <p class="text-slate-400 mb-3">
                    These two summoners have no match history in common. This could mean:
                </p>
                <ul class="list-disc list-inside mt-1 pl-4 text-sm text-slate-500 space-y-1">
                    <li>They never played together</li>
                    <li>They played together outside the recent 20 matches returned by Riot</li>
                    <li>The summoner name or tagline is incorrect</li>
                </ul>
            </div>
        `);
        setStatus(`Searched: ${escapeHtml(playerA.name)} (${escapeHtml(playerA.tagline)}) vs ${escapeHtml(playerB.name)} (${escapeHtml(playerB.tagline)})`);
        return;
    }

    // Build results HTML
    let html = `
        <div class="bg-slate-950 border border-slate-700 rounded-xl p-6 shadow-md">
            <h3 class="text-lg font-bold text-amber-200 mb-2">Shared Games Found</h3>
            <p class="text-slate-400 text-sm mb-4">
                ${escapeHtml(playerA.name)} (${escapeHtml(playerA.tagline)}) & ${escapeHtml(playerB.name)} (${escapeHtml(playerB.tagline)})
                share <strong class="text-amber-300">${sharedMatches.length}</strong> game(s).
            </p>
            <div class="space-y-4">
    `;

    sharedMatches.forEach((match, index) => {
        const resultText = match.weWon ? 'Victory' : 'Defeat';
        const resultClass = match.weWon ? 'text-green-400' : 'text-red-400';
        const minutes = Math.floor(match.gameDuration / 60);
        const seconds = match.gameDuration % 60;
        const duration = `${minutes}m ${seconds}s`;

        // Helper to render an image tag with fallback
        const imgTag = (src, alt, cls) => src
            ? `<img src="${src}" alt="${escapeHtml(alt)}" class="${cls} rounded" />`
            : `<div class="${cls} rounded bg-slate-700 flex items-center justify-center text-slate-500 text-xs">?</div>`;

        // Build item image row (max 6 slots)
        let itemImgs = '';
        match.itemImageUrls.forEach((url, i) => {
            if (url) {
                itemImgs += `<img src="${url}" alt="item" class="w-8 h-8 rounded" />`;
            } else {
                itemImgs += `<div class="w-8 h-8 rounded bg-slate-800 border-2 border-dashed border-slate-700"></div>`;
            }
        });

        html += `
            <div class="border border-slate-800 rounded-lg p-4 bg-slate-900/50">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center gap-2">
                        ${match.championImageUrl ? imgTag(match.championImageUrl, match.ourChampion, 'w-10 h-10') : ''}
                        <span class="font-bold text-amber-300">#${index + 1}</span>
                        <span class="text-slate-400 text-sm">${escapeHtml(match.date)}</span>
                    </div>
                    <span class="${resultClass} font-bold">${escapeHtml(resultText)}</span>
                </div>
                <div class="text-sm text-slate-300 space-y-1">
                    <p><span class="font-semibold">Mode:</span> ${escapeHtml(match.gameMode)}</p>
                    <p>Duration: ${duration}</p>
                </div>
                <div class="flex items-center gap-4 my-2">
                    ${match.championImageUrl ? imgTag(match.championImageUrl, match.ourChampion, 'w-12 h-12') : ''}
                    <div class="flex gap-1">
                        ${match.summoner1ImageUrl ? imgTag(match.summoner1ImageUrl, 'Summoner Spell 1', 'w-8 h-8') : ''}
                        ${match.summoner2ImageUrl ? imgTag(match.summoner2ImageUrl, 'Summoner Spell 2', 'w-8 h-8') : ''}
                    </div>
                    <div class="flex gap-1">
                        ${itemImgs}
                    </div>
                    <span class="font-semibold">Champion:</span> ${escapeHtml(match.ourChampion)}
                </div>
                <div class="text-sm text-slate-400">
                    <p>KDA: ${escapeHtml(String(match.ourKills))}/${escapeHtml(String(match.ourDeaths))}/${escapeHtml(String(match.ourAssists))}</p>
                    <p>Participants: ${escapeHtml(String(match.participantsCount))}</p>
                </div>
                <div class="mt-2 flex gap-2">
                    <a href="${opggUrl(playerA.region, match.matchId)}" target="_blank" rel="noopener"
                       class="text-xs bg-amber-600 hover:bg-amber-500 text-white px-3 py-1 rounded transition">
                        View on op.gg →
                    </a>
                    <a href="${uggUrl(match.matchId)}" target="_blank" rel="noopener"
                       class="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded transition">
                        View on u.gg →
                    </a>
                </div>
            </div>
        `;
    });

    html += '</div></div>';

    showResults(html);
    setStatus(`Found ${sharedMatches.length} shared game(s) between ${playerA.name} and ${playerB.name}`);
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

/**
 * Handle the form submission: find shared games.
 */
async function handleSearch() {
    clearResults();

    // Read Riot ID inputs and parse "name#tagline"
    const riotIdA = document.getElementById('playerARiotId').value.trim();
    const riotIdB = document.getElementById('playerBRiotId').value.trim();
    const regionA = document.getElementById('playerARegion').value;
    const maxGames = parseInt(document.getElementById('maxGames').value, 10);

    const [nameA, taglineA] = parseRiotId(riotIdA);
    const [nameB, taglineB] = parseRiotId(riotIdB);

    if (!nameA || !nameB || !taglineA || !taglineB) {
        setStatus('Enter both Riot IDs in the format "name#tagline".');
        return;
    }
    if (!regionA) {
        setStatus('Please select both players\' regions.');
        return;
    }

    // Check if routing regions differ (cross-routing-region searches cannot find shared games)
    const routingA = getRoutingRegion(regionA);
    const routingB = getRoutingRegion(regionA); // same region
    if (routingA !== routingB) {
        setStatus(`Warning: Selected regions are in different routing regions (${routingA} vs ${routingB}). Shared games across routing regions are not possible.`);
        // Still proceed with search, but it will likely return no shared matches
    }

    try {
        const result = await findSharedGames(nameA, taglineA, regionA, nameB, taglineB, regionA, maxGames);
        renderResults(result);
    } catch (err) {
        safeLog('Search failed:', err);
        let message = 'Something went wrong.';
        if (err.message) {
            message = err.message;
        }
        // Append diagnostics summary if available
        const timings = window.__whodisTimings ? window.__whodisTimings() : [];
        const diagHtml = timings.length ? `<p class="text-slate-500 text-xs mt-2">Diagnostics: ${timings.map(t => `${t.label}(${t.region})=${t.ms}ms`).join(', ')}</p>` : '';
        showResults(`
            <div class="bg-slate-950 border border-red-700 rounded-xl p-6 shadow-md">
                <h3 class="text-lg font-bold text-red-300 mb-2">Search Failed</h3>
                <p class="text-slate-400 text-sm">${escapeHtml(message)}</p>
                <p class="text-slate-500 text-xs mt-2">
                    If you see a CORS/network error, the backend proxy may not be running.
                    Start it with <code>npm start</code> (requires <code>RIOT_API_KEY</code> env var).
                </p>
                ${diagHtml}
            </div>
        `);
        setStatus(`Error: ${message}`);
    }
}

/**
 * Parse a Riot ID string like "name#tagline" into [name, tagline].
 * @param {string} riotId
 * @returns {[string, string]} [name, tagline]
 */
function parseRiotId(riotId) {
    const idx = riotId.lastIndexOf('#');
    if (idx <= 0 || idx === riotId.length - 1) {
        return ['', ''];
    }
    return [riotId.slice(0, idx), riotId.slice(idx + 1)];
}