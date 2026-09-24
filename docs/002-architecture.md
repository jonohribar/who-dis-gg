# Architecture — whodis.gg

## System Overview

whodis.gg is a web application that helps League of Legends players find which games they played with another player (e.g., a friend request sender).

## Core Algorithm

```
Input: RiotID_A + region_A + RiotID_B + region_B
  ↓
Step 1: Resolve Riot IDs (account-v1)
  GET /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
  → PUUID_A, PUUID_B
  ↓
Step 2: Get Match Lists (match-v5)
  GET /lol/match/v5/matches/by-puuid/{puuid}/ids?count=100
  → matchIds_A[], matchIds_B[]
  ↓
Step 3: Find Intersection
  sharedMatchIds = matchIds_A ∩ matchIds_B
  ↓
Step 4: Fetch Shared Match Details (match-v5)
  For each matchId in sharedMatchIds (max 20):
    GET /lol/match/v5/matches/{matchId}
    → filter participants by PUUID_A and PUUID_B
    → extract champion, result, builds, etc.
  ↓
Step 5: Display Results
  List shared games with details + op.gg/u.gg links
```

## Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | HTML5 + Vanilla JS + Tailwind CSS (3.4.17) | Simple, no build step, works everywhere |
| Backend | Node.js + Express + node-fetch | Proxy to secure API key, handle CORS |
| Hosting | GitHub Pages (frontend) + Render/Railway/Fly.io (backend) | Free tiers available |
| API | Riot Games Developer API | Official source, free tier sufficient |
| Data Format | JSON | Standard for web APIs |

## Data Flow

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  User Browser   │────▶│ GitHub Pages │────▶│  Local/Deployed │
│  (HTML/JS/CSS)  │◀────│  (Static)    │◀────│   Backend Proxy │
└─────────────────┘     └──────────────┘     └────────┬────────┘
                                                      │
                                                      ▼
                                               ┌─────────────────┐
                                               │  Riot Games API │
                                               │  (JSON responses)│
                                               └─────────────────┘
```

## Project Structure

```
whodis.gg/
├── docs/                    # Project documentation
│   ├── 001-README.md        # Docs index
│   ├── 002-architecture.md  # This file
│   ├── 003-user-requirements.md
│   ├── 004-project-plan.md
│   └── research/
│       ├── existing-sites.md
│       ├── riot-api.md
│       └── website-building.md
├── frontend/                # Static frontend (hosted on GitHub Pages)
│   ├── index.html           # Main page
│   ├── app.js               # Core logic
│   ├── config.js            # Runtime config (gitignored)
│   └── config.example.js    # Config template
├── backend/                 # Express proxy server
│   └── server.js            # Proxy endpoints
├── config/                  # Environment config
│   └── .env.example         # Env template
├── tests/                   # Test files
│   ├── intersection.test.js # Intersection logic tests
│   └── test-intersection.js # Additional tests
├── .gitignore
├── package.json
├── package-lock.json
└── README.md                # Project README
```

## API Endpoints Used

1. **Account Lookup**: `/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}`
2. **Match List**: `/lol/match/v5/matches/by-puuid/{puuid}/ids?count=100`
3. **Match Details**: `/lol/match/v5/matches/{matchId}`

## Backend Proxy Endpoints

The Express server (`backend/server.js`) provides:
- `GET /health` — health check
- `GET /api/riot/:region/*` — proxies to `https://{region}.api.riotgames.com/*`
- `POST /api/riot/:region/*` — proxies POST requests
- Rate limiting: 20 req/sec per IP
- CORS enabled for frontend origin
- Reads `RIOT_API_KEY` from environment (via dotenv)

## Frontend Configuration

`frontend/config.js` (gitignored, copy from `config.example.js`):
- `BACKEND_URL` — e.g., `http://localhost:3001` or deployed backend URL
- `MATCH_HISTORY_COUNT` — 100
- `REGIONS` — platform code → routing region mapping
- `DISPLAY.maxSharedGames` — 20

## External Links (op.gg Integration)

For full match details, link to:
- **OP.GG**: `https://op.gg/lol/match-detail/match?matchId={matchId}&region={regionTag}`
- **U.GG**: `https://u.gg/lol/match/{matchId}`

## Security Considerations

- **Riot API key is never exposed to the browser** — it lives only in the backend's `process.env.RIOT_API_KEY`
- Frontend calls the local backend proxy (`BACKEND_URL`) without any API key
- Backend adds `X-Riot-Token` header server-side
- `frontend/config.js` is gitignored; only `config.example.js` is tracked
- CORS restricted to frontend origin in production

## Rate Limiting

- Backend enforces 20 req/sec per IP (matches Riot's limit)
- Frontend enforces 50ms minimum interval between requests (mutex)
- 429 responses trigger exponential backoff (3 retries: 1s, 2s, 4s)

## Limitations

- Match history limited to 100 most recent games per player (Riot API limit)
- Shared games only found within same routing region (cross-shard not possible)
- Requires backend server running with valid `RIOT_API_KEY`
- Free tier Riot API key expires ~24h; must be rotated