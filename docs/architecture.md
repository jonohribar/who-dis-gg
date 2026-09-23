# Architecture — whodis.gg

## Overview

This document captures the architectural decisions made during research. It will evolve as the project progresses from research to development.

## Core Decision: Riot API Only

**Choice:** Use the Riot Games Developer API as the sole primary data source.

**Rationale:**
- Riot API provides everything needed for the core feature (find shared games, match details, builds)
- No third-party scraping needed
- Official, stable, well-documented API
- Free tier sufficient for individual use
- No dependency on third-party sites changing their scrapers or APIs

**Fallback:** op.gg multi-search URL pattern can be used to generate comparison links if Riot data is unavailable.

## System Architecture

### Data Flow

```
┌─────────────────┐     ┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│  User Browser   │────▶│  Backend     │────▶│  Riot API     │────▶│  Game Data   │
│  (HTML + JS)    │◀────│  (Node.js)   │◀────│  (API Calls)  │◀────│  (Match DB)  │
└─────────────────┘     └──────────────┘     └───────────────┘     └──────────────┘
        │                       │
        │  Display results      │  Proxy requests
        │◀──────────────────────│◀─────────────────
```

### Components

1. **Frontend** (Browser):
   - Single HTML page with input form (two summoner names + regions)
   - Vanilla JavaScript for fetch calls to backend
   - Results displayed in a table: date, queue, result, champions, links
   - Links to op.gg match pages for detailed builds

2. **Backend** (Node.js + Express):
   - `/api/summoners/{region}/{name}` → Resolve name to puuid
   - `/api/matches/shared` → Accept two puuids, return shared game IDs
   - `/api/match/{matchId}` → Fetch full match details
   - API key stored in environment variables (never exposed to browser)

3. **External API**:
   - Riot Games Developer API (developer.riotgames.com)
   - Endpoints: Summoner V4, Match V5

### Deployment Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Netlify    │────▶│  Railway    │────▶│  Riot API   │
│  (Frontend) │     │  (Backend)  │     │  (Data)     │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Data Schema

### Shared Game Result

```json
{
  "gameId": "string",
  "gameCreation": 1234567890,
  "gameDuration": 1800,
  "queueType": "RANKED_SOLO_5x5",
  "gameMode": "CLASSIC",
  "teams": [
    { "win": true, "champions": [1, 2, 3, 4, 5] },
    { "win": false, "champions": [6, 7, 8, 9, 10] }
  ],
  "participants": [
    {
      "summonerName": "Player1",
      "championId": 1,
      "teamId": 100,
      "stats": {
        "kills": 5, "deaths": 2, "assists": 8,
        "totalMinionsKilled": 200, "goldEarned": 15000
      },
      "items": [3006, 3031, 3085, ...],
      "runes": { "primary": {...}, "secondary": {...} }
    }
  ]
}
```

## Future Architecture Considerations

When moving to Phase 2+, these may be added:
- **Database**: SQLite or PostgreSQL for caching match data, storing user preferences
- **Authentication**: Simple session/cookie or OAuth (Riot OAuth for summoner linking)
- **Caching Layer**: Redis or in-memory cache for frequently accessed match data
- **Background Jobs**: Periodic polling for new friend request notifications

## Technology Stack Summary

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | HTML, Tailwind CSS, Vanilla JS | Minimal learning curve, sufficient for MVP |
| Backend | Node.js + Express | JavaScript across stack, simple routing |
| API | Riot Games Developer API | Official, complete data, free tier |
| Hosting | Netlify + Railway | Free tier, easy deployment |
| Database (Phase 2) | SQLite (local) or Supabase (cloud) | Simple, no server needed |
| CI/CD | GitHub Actions | Automated testing and deployment |

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Riot API rate limits | Medium | High | Cache results, limit queries per session |
| API key exposure | High | Medium | Always use backend proxy, never put key in frontend |
| Riot API changes | Low | High | Abstract API calls behind backend functions |
| Learning curve too steep | Medium | Medium | Start with MVP, don't add features until MVP works |
| Data privacy concerns | Low | Medium | No user accounts needed in MVP, no PII stored |

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-01 | Riot API as primary source | Official API provides all needed data without scraping |
| 2025-01 | Vanilla JS over React | Minimal complexity for single-page tool |
| 2025-01 | Backend proxy for API key security | Never expose API key in browser |
| 2025-01 | Node.js + Express for backend | JavaScript consistency with frontend learning |
