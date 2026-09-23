# Architecture — whodis.gg

## System Overview

whodis.gg is a web application that helps League of Legends players find which games they played with another player (e.g., a friend request sender).

## Core Algorithm

```
Input: summonerNameA + regionA + summonerNameB + regionB
  ↓
Step 1: Resolve Riot IDs
  GET /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
  → PUUID_A, PUUID_B
  ↓
Step 2: Get Match Lists
  GET /lol/match/v5/matches/by-puuid/{puuid}/ids?count=100
  → matchIds_A[], matchIds_B[]
  ↓
Step 3: Find Intersection
  sharedMatchIds = matchIds_A ∩ matchIds_B
  ↓
Step 4: Fetch Shared Match Details
  For each matchId in sharedMatchIds:
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
| Frontend | HTML5 + Vanilla JS + Tailwind CSS | Simple, no build step, works everywhere |
| Hosting | GitHub Pages | Free, fast, simple |
| API | Riot Games Developer API | Official source, free tier sufficient |
| Data Format | JSON | Standard for web APIs |

## Data Flow

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  User Browser   │────▶│  GitHub Pages│────▶│  Riot Games API │
│  (HTML/JS/CSS)  │◀────│  (Static)    │◀────│  (JSON responses)│
└─────────────────┘     └──────────────┘     └─────────────────┘
```

## Project Structure

```
whodis.gg/
├── docs/                    # Project documentation
│   ├── README.md            # Docs index
│   ├── user-requirements.md
│   ├── project-plan.md
│   ├── architecture.md      # This file
│   └── research/
│       ├── existing-sites.md
│       ├── riot-api.md
│       └── website-building.md
├── src/                     # Application code
│   ├── index.html           # Main page
│   ├── style.css            # Custom styles
│   ├── app.js               # Core logic
│   └── config.js            # Configuration (API endpoints)
├── tests/                   # Test files (future)
│   └── README.md
├── .gitignore
└── README.md                # Project README
```

## API Endpoints Used

1. **Account Lookup**: `/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}`
2. **Match List**: `/lol/match/v5/matches/by-puuid/{puuid}/ids`
3. **Match Details**: `/lol/match/v5/matches/{matchId}`

## External Links (op.gg Integration)

For full match details, link to:
- **OP.GG**: `https://op.gg/lol/matches/{matchId}`
- **U.GG**: Match URL varies; use OP.GG as primary match link source

## Security Considerations

- Riot API key should NOT be exposed in client-side code for production
- For MVP (personal use), browser-based API calls acceptable
- Future: Move to backend proxy for API key protection

## Limitations (MVP)

- Static site = no server-side processing
- API key visible in source (acceptable for personal use)
- CORS may require a proxy for direct browser calls
- Match history limited by API rate limits
