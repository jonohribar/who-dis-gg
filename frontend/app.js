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

// ─── CORS Proxy ───────────────────────────────────────────────────────────────
// Riot API blocks browser requests (no CORS). Use a proxy for MVP testing.
// Production: move this to a backend server.
const CORS_PROXY = 'https://corsproxy.io/?';

// ─── API Helpers ──────────────────────────────────────────────────────────────

/**
 * Build the full Riot API URL for a given endpoint.
 * @param {string} regionCode - Platform code, e.g. 'NA1' or 'OC1'
 * @param {string} endpoint - e.g. '/riot/account/v1/accounts/by-riot-id/Faker/NA1'
 * @returns {string} Full URL
 */
function riotUrl(regionCode, endpoint) {
    const regionConfig = window.CONFIG.REGIONS[regionCode];
    if (!regionConfig) {
        throw new Error(`Unknown region: ${regionCode}`);
    }
    const base = `https://${regionConfig.apiRegion}.api.riotgames.com`;
    return `${base}${endpoint}`;
}

/**
 * Fetch from Riot API with CORS proxy and auth header.
 * @param {string} url - Full URL
 * @returns {Promise<object>} JSON response
 */
async function fetchRiot(url) {
    const proxyUrl = CORS_PROXY + encodeURIComponent(url);
    const response = await fetch(proxyUrl, {
        headers: {
            'X-Riot-Token': window.CONFIG.API_KEY,
        },
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        let errorMessage = `HTTP ${response.status}`;
        try {
            const json = JSON.parse(errorBody);
            errorMessage = json.status?.message || errorMessage;
        } catch (_) {
            // use status text
        }
        throw new Error(errorMessage);
    }

    return response.json();
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
    const data = await fetchRiot(url);
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
    const data = await fetchRiot(url);
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
    return await fetchRiot(url);
}

/**
 * Extract relevant info from a match detail for display.
 * @param {object} match - Match detail from Riot API
 * @param {string} puuid - Our PUUID (to determine our team/role)
 * @returns {object} Simplified match info
 */
function extractMatchInfo(match, puuid) {
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
async function findSharedGames(nameA, taglineA, regionA, nameB, taglineB, regionB) {
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
    const maxMatches = window.CONFIG.DISPLAY.maxSharedGames || 20;
    const matchesToFetch = sharedMatchIds.slice(0, maxMatches);
    const sharedMatches = [];

    for (let i = 0; i < matchesToFetch.length; i++) {
        const matchId = matchesToFetch[i];
        setStatus(`📊 Fetching match ${i + 1}/${matchesToFetch.length}...`);
        try {
            const matchDetail = await fetchMatchDetail(matchId, regionA);
            const info = extractMatchInfo(matchDetail, playerA.puuid);
            sharedMatches.push(info);
        } catch (err) {
            // Skip failed match fetches
            console.error(`Failed to fetch match ${matchId}:`, err.message);
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
                    <li>They played together outside the recent 100 matches returned by Riot</li>
                    <li>The summoner name or tagline is incorrect</li>
                </ul>
            </div>
        `);
        setStatus(`Searched: ${playerA.name} (${playerA.tagline}) vs ${playerB.name} (${playerB.tagline})`);
        return;
    }

    // Build results HTML
    let html = `
        <div class="bg-slate-950 border border-slate-700 rounded-xl p-6 shadow-md">
            <h3 class="text-lg font-bold text-amber-200 mb-2">Shared Games Found</h3>
            <p class="text-slate-400 text-sm mb-4">
                ${playerA.name} (${playerA.tagline}) &amp; ${playerB.name} (${playerB.tagline})
                share <strong class="text-amber-300">${sharedMatches.length}</strong> game(s).
            </p>
            <div class="space-y-4">
    `;

    sharedMatches.forEach((match, index) => {
        const resultText = match.weWon ? '✅ Victory' : '❌ Defeat';
        const resultClass = match.weWon ? 'text-green-400' : 'text-red-400';
        const minutes = Math.floor(match.gameDuration / 60);
        const seconds = match.gameDuration % 60;
        const duration = `${minutes}m ${seconds}s`;

        html += `
            <div class="border border-slate-800 rounded-lg p-4 bg-slate-900/50">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <span class="font-bold text-amber-300">#${index + 1}</span>
                        <span class="text-slate-400 text-sm">${match.date}</span>
                    </div>
                    <span class="${resultClass} font-bold">${resultText}</span>
                </div>
                <div class="text-sm text-slate-300 space-y-1">
                    <p>🎮 <span class="font-semibold">Mode:</span> ${match.gameMode}</p>
                    <p>⏱️ <span class="font-semibold">Duration:</span> ${duration}</p>
                    <p>🗡️ <span class="font-semibold">Your Champion:</span> ${match.ourChampion}</p>
                    <p>📊 <span class="font-semibold">Your KDA:</span> ${match.ourKills}/${match.ourDeaths}/${match.ourAssists}</p>
                    <p>👥 <span class="font-semibold">Participants:</span> ${match.participantsCount}</p>
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
    const regionB = document.getElementById('playerBRegion').value;

    const [nameA, taglineA] = parseRiotId(riotIdA);
    const [nameB, taglineB] = parseRiotId(riotIdB);

    if (!nameA || !nameB || !taglineA || !taglineB) {
        setStatus('Enter both Riot IDs in the format "name#tagline".');
        return;
    }
    if (!regionA || !regionB) {
        setStatus('Please select both players\' regions.');
        return;
    }

    try {
        const result = await findSharedGames(nameA, taglineA, regionA, nameB, taglineB, regionB);
        renderResults(result);
    } catch (err) {
        console.error('Search failed:', err);
        let message = 'Something went wrong.';
        if (err.message) {
            message = err.message;
        }
        showResults(`
            <div class="bg-slate-950 border border-red-700 rounded-xl p-6 shadow-md">
                <h3 class="text-lg font-bold text-red-300 mb-2">Search Failed</h3>
                <p class="text-slate-400 text-sm">${message}</p>
                <p class="text-slate-500 text-xs mt-2">
                    If you see a CORS/network error, your browser blocked the Riot API request.
                    We'll fix this by adding a simple backend proxy.
                </p>
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
