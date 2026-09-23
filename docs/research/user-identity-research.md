# User Identity & API Research — whodis.gg

Status: PARTIAL (web searches hit rate limit, but key evidence gathered)

---

## 1. Riot Account Identity

**What is a Riot ID?**
The Riot ID is composed of `gameName + tagLine` (e.g., "Faker#NA1"). The endpoint requires BOTH.

> Source: Riot Developer Portal — `/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}` (https://developer.riotgames.com/api-details/account-v1)

> Response format (`AccountDto`): { `puuid`: "78-char encrypted PUUID", `gameName`: "...", `tagLine`: "..." }

**Tagline:**
- Not always "NA1" — can be any string (e.g., "NA1", "EUW1", "KR", or custom taglines like "2222")
- Tagline is part of the account identity, not just server region
- Source: Riot Developer docs + source code snippet (`tag_line: String`, optional)

**Key point:** The user must provide BOTH the username/gameName AND the tagline, not just the username.

---

## 2. Regional Servers / All Regions

**Currently supported by Riot API (all active):**
- Americas: NA1, BR1, LA1, LA2
- Europe: EUW1, EUN1, TR1, RU, 
- Asia: KR, JP, SG, PH, TH, TW
- Oceania: OC1
- Others: VN

The `frontend/config.js` currently only has NA1/EUW1/KR — needs all.

---

## 3. What User Must Provide

Based on Riot API requirements:`

```
When using whodis.gg, the user must provide:
- [ ] Player A: Summoner name (gameName) — e.g., "Faker"
- [ ] Player A: Tagline — e.g., "NA1" (NOT just region dropdown)
- [ ] Player A: Region/Server — for routing (NA1, EUW1, etc.)
- [ ] Player B: Summoner name (gameName)
- [ ] Player B: Tagline
- [ ] Player B: Region/Server
```

**Important:** The tagLine and region are separate. The tagLine (e.g., "NA1") is part of the Riot ID; region is for API routing.

---

## 4. Identifier Chain

```
User input (gameName + tagLine)
    ↓
Riot API: /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
    ↓
PUUID (encrypted, 78 chars) ← KEY for all other APIs
    ↓
/riot/summoner/v4/summoners/by-puuid/{puuid}
    ↓
Summoner ID (for legacy APIs)
    ↓
/lol/match/v5/matches/by-puuid/{puuid}/ids
    ↓
Match IDs (list of strings)
    ↓
/lol/match/v5/matches/{matchId}
    ↓
Match details (participants array, results, builds)
```

---

## 5. Alternative APIs — op.gg / u.gg

**op.gg:** No official public API. OP.GG says data comes from Riot official APIs. The OP.GG MCP server exists (`https://mcp-api.op.gg/mcp`) but is for AI agent access, not general use.

**u.gg:** Has a GraphQL endpoint (`https://u.gg/api`) used internally — community code (`replay_scraper.py`) shows it. Not officially documented for third-party use.

**Recommendation:** Continue to rely on Riot API directly; supplement with op.gg/u.gg links for detailed views.

---

## 6. OpenAPI Spec / JSON

The Riot Games OpenAPI spec is available at:
`https://raw.githubusercontent.com/api-evangelist/riot-games/refs/heads/main/openapi/riot-games-summoner-api-openapi.yml`

This is a YAML file, not JSON, but it can be converted. It defines all endpoints precisely.

---

## Blockers / Unresolved

- Full region list not fully verified (some sources say different counts)
- Exact match-v5 response format not fully retrieved (Exa rate limit)
- Whether tagLine can be empty/default needs confirmation
- op.gg/u.gg scraping feasibility not fully tested
