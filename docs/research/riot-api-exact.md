# Exact Riot API Endpoints — Research

## Source
- Riot Developer Portal: https://developer.riotgames.com/ (read via fetch_content)
- Riot API reference (search result): skillmd.ai riot-api-reference
- DeepWiki katapi project (search result): endpoint listings
- league-sdk (GitHub: adrianmg/league-sdk)

## Key Endpoints

### 1. Account Lookup (Username + Tagline → PUUID)
- **Endpoint:** `GET /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}`
- **Platform:** Regional (`americas.api.riotgames.com`, `europe.api.riotgames.com`, `asia.api.riotgames.com`)
- **Parameters:** gameName (string, required), tagLine (string, required), api_key (query, required)
- **Response (sample):**
  ```json
  { "puuid": "...", "gameName": "...", "tagLine": "..." }
  ```
- **Critical finding:** The tagline IS part of the Riot ID. You need BOTH username and tagline.

### 2. Summoner Lookup (PUUID → Summoner Profile)
- **Endpoint:** `GET /lol/summoner/v4/summoners/by-puuid/{encryptedPUUID}`
- **Platform:** Platform-routed (e.g., `na1.api.riotgames.com`, `euw1.api.riotgames.com`)
- **Response fields:** `id` (encrypted summoner ID), `puuid`, `name`, `profileIconId`, `revisionDate`, `summonerLevel`

### 3. Match List by PUUID
- **Endpoint:** `GET /lol/match/v5/matches/by-puuid/{puuid}/ids`
- **Query params:** count (max 100), start (pagination offset), startTime, endTime, queue (queue ID), type (Ranked/Normal/Custom)
- **Response:** Array of match IDs (strings)

### 4. Match Detail by Match ID
- **Endpoint:** `GET /lol/match/v5/matches/{matchId}`
- **Response key fields for shared-game detection:**
  - `metadata.gameCreation` (timestamp of match creation)
  - `metadata.gameMode` (e.g., "SoloQueue", "DuoQueue", "Ranked", "Custom")
  - `metadata.queueId`
  - `info.participants` (array with `puuid`, `summonerName`, `championId`, `championName`, `kills`, `deaths`, `assists`, `teamId`, `teamPosition`, `win`, items, runes)
  - `info.teams` (array with `teamId`, `members` array containing `puuid`, `championName`)

## Rate Limits (Exact from Developer Portal)

| Key Type         | Per Region Rate            |
|------------------|----------------------------|
| Development      | Temporary, expires every 24h |
| Personal         | 20 requests / 1 sec; 100 / 2 min |
| Production       | 500 / 10 sec; 30,000 / 10 min |

Rate limits are enforced per region. Calls to NA1 and EUW1 simultaneously count separately.

## Routing Rules

| Endpoint | Routing Type | Example URL |
|----------|--------------|-------------|
| Account V1 | Regional (americas/europe/asia) | `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Faker/NA1` |
| Summoner V4 | Platform (na1.euw1.kr etc.) | `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}` |
| Match V5 | Regional (americas/europe/asia) | `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids` |
| Match Detail | Regional (same as match list) | `https://americas.api.riotgames.com/lol/match/v5/matches/{matchId}` |

## Supported LoL Regions / Platforms

Full list: NA1, EUW1, EUW (alt), KR, BR1, LA1, LA2, OC1, TR1, RU, SG, PH, TH, TW, JP, VN

Regional routing groups:
- **americas:** NA1, BR1, LA1, LA2
- **europe:** EUW1, TR1, RU, (possibly others)
- **asia:** KR, JP, (possibly others)

## Error Handling (Confirmed from Portal)

- Only HTTP 200 guarantees JSON response body
- 401 = missing API key (Unauthorized)
- 403 = invalid/blacklisted key (Forbidden)
- 404 = summoner/match not found (Not Found)
- 429 = rate limit exceeded → check `Retry-After` header
- All error responses are NOT guaranteed to be JSON — logic should depend on status code alone

## JSON / Download Spec

- **No downloadable OpenAPI/Swagger spec** found at developer.riotgames.com
- Documentation is web-based only at https://developer.riotgames.com/
- **No JSON export available** from Riot directly
- Third-party SDKs (e.g., katapi, league-sdk) wrap endpoints with typed clients (Gson/Retrofit) but don't provide a machine-readable spec

## Blockers / Risks

1. **Development keys expire every 24 hours** — must reset frequently during development
2. **Rate limits enforced per region** — need to handle 429 gracefully
3. **Match V5 requires PUUID** (not Summoner ID) — must resolve names → PUUID in sequence via Account V1
4. **No official JSON spec** — manual documentation will be needed
5. **CORS** — browser-based calls need a backend proxy (API key security)

## Match Intersection Algorithm

Given two players (gameName1, tagLine1) and (gameName2, tagLine2):

1. Resolve both: `GET /riot/account/v1/accounts/by-riot-id/{gameName1}/{tagLine1}` → `puuid1`
2. Resolve both: `GET /riot/account/v1/accounts/by-riot-id/{gameName2}/{tagLine2}` → `puuid2`
3. Fetch matches: `GET /lol/match/v5/matches/by-puuid/{puuid1}/ids` → `matchIdsA` (max 100)
4. For each matchId in matchIdsA:
   - `GET /lol/match/v5/matches/{matchId}` → check `info.participants` for `puuid2`
   - If found → this is a shared game
5. Fetch shared match details and display

**Optimization:** Could fetch both match lists and intersect sets first, but match detail call is needed to confirm. Fetching ~100 matches from player A and checking participants is the simplest approach.

## Source Pointers

- Developer Portal docs: https://developer.riotgames.com/ (sections: "Web APIs", "API Keys", "Rate Limiting", "Response Codes")
- Riot API reference (endpoint table): https://skillmd.ai/skills/riot-api-reference/
- KatApi endpoint listing: https://deepwiki.com/katarem/KatApi/7.1-lolinterface
- Identifier conversion: https://deepwiki.com/katarem/KatApi/4.1-account-and-summoner
- league-sdk: https://github.com/adrianmg/league-sdk
