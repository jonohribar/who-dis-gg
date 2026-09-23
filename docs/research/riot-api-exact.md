# Exact Riot API Endpoints — whodis.gg

Status: PARTIAL (some sources hit rate limit, but key endpoints verified)

---

## 1. Summoner Lookup by Riot ID (with tagLine)

**Endpoint:**  
`GET /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}`

**Path Parameters:**
- `gameName` (string, required): The summoner name (e.g., "Faker")
- `tagLine` (string, required): The tagline (e.g., "NA1", "2222", "KR")

**Security:** Requires API key header (`X-Riot-Token: <your_api_key>`)

**Response (200 OK):** `AccountDto` object
```json
{
  "puuid": "78-character encrypted string",  // e.g., "ABCDEF..."
  "gameName": "Faker",
  "tagLine": "NA1"
}
```

**Notes:**
- Both `gameName` and `tagLine` are required
- The PUUID is used for ALL subsequent game-specific calls
- Source: Riot Developer Portal (https://developer.riotgames.com/api-details/account-v1)

---

## 2. Summoner Profile by PUUID (Legacy)

**Endpoint:**  
`GET /lol/summoner/v4/summoners/by-puuid/{encryptedPUUID}`

**Path Parameters:**
- `encryptedPUUID` (string, required): The 78-char PUUID from account-v1

**Response:** `SummonerDto` (contains summoner level, profile icon, revision date, etc.)

---

## 3. Match List by PUUID

**Endpoint:**  
`GET /lol/match/v5/matches/by-puuid/{puuid}/ids`

**Path Parameters:**
- `puuid` (string, required): The PUUID

**Query Parameters (optional):**
- `start` (integer, default 0): Pagination start index
- `count` (integer, default 20, max 100): Number of match IDs to return
- `queue` (integer, optional): Filter by queue ID (420=Ranked Solo, 440=Ranked Flex, etc.)
- `type` (string, optional): Filter by match type ("ranked", "normal", "tourney", "tutorial")
- `endTime` (long, optional): Unix ms timestamp
- `beginTime` (long, optional): Unix ms timestamp

**Response:** Array of match ID strings
```json
[
  "KR_1234567890",
  "KR_0987654321"
]
```

**Notes:**
- Returns match IDs only — to get details, call match-v5 for each ID
- Max 100 per request (can paginate with `start`)
- Source: OpenAPI spec (https://raw.githubusercontent.com/api-evangelist/riot-games/refs/heads/main/openapi/riot-games-match-api-openapi.yml)

---

## 4. Match Detail by Match ID

**Endpoint:**  
`GET /lol/match/v5/matches/{matchId}`

**Path Parameters:**
- `matchId` (string, required): The full match ID (e.g., "KR_1234567890")

**Response:** `MatchDto` object (detailed)
Key sections:
```json
{
  "metadata": {
    "matchId": "KR_1234567890",
    "dataVersion": "3",
    "participants": ["puuid1", "puuid2", ...],
    "gameCreation": 1700000000000,
    "gameDuration": 1800000,  // ms
    "gameMode": "CLASSIC",
    "gameName": "League of Legends",
    "gameType": "MATCHED_GAME",
    "mapId": 11,
    "queueId": 420,  // Ranked Solo
    "tournamentCode": "",
    "teams": [ ... ]
  },
  "info": {
    "gameCreation": 1700000000000,
    "gameDuration": 1800000,
    "gameEndTimestamp": 1700001800000,
    "gameId": 1234567890,
    "gameMode": "CLASSIC",
    "gameName": "League of Legends",
    "gameStartTimestamp": 1700000000000,
    "gameType": "MATCHED_GAME",
    "mapId": 11,
    "participants": [
      {
        "puuid": "puuid1",
        "summonerName": "Faker",
        "summonerId": "12345",
        "summonerLevel": 178,
        "teamId": 100,
        "teamPosition": "MIDDLE",
        "championId": 7,   // e.g., 7 = Teemo
        "championName": "Teemo",
        "riotIdGameName": "Faker",
        "riotIdTagline": "NA1",
        "individualPosition": "MIDDLE",
        "lane": "MIDDLE",
        "role": "SOLO",
        "kills": 10,
        "deaths": 2,
        "assists": 15,
        "totalDamageDealt": 25000,
        "goldEarned": 12000,
        "totalMinionsKilled": 150,
        "champExperience": 80000,
        "win": true,
        // Items: item0 through item6
        "item0": 3078,   // Trinity Force
        "item1": 3025,
        "item2": 3111,
        // ... up to item6 (0 = no item)
        // Runes (primary and secondary styles)
        "perk0": 8005,   // Conqueror
        "perk1": 9103,
        // ... up to perk4
        "perkSubStyle": 8000,
        "perkSubStyle": [8008, 8009],
        // Summoner spells
        "summoner1Id": 4,  // Flash
        "summoner2Id": 14  // Ignite
      }
    ],
    "teams": [
      {
        "teamId": 100,
        "win": true,
        // bans (if any)
        "bans": [
          {
            "pickTurn": 1,
            "championId": 1
          }
        ],
        "objectives": {
          "baron": { "first": true, "kills": 1 },
          "dragon": { "first": true, "kills": 4 },
          "inhibitor": { "first": true, "kills": 1 },
          "tower": { "first": true, "kills": 5 }
        }
      }
    ]
  }
}
```

**Notes:**
- Contains all participant data (puuid, summonerName, champion, kills/deaths/assists, items, runes, summoner spells)
- Teams section shows objectives, bans, win status
- This is where we extract "what everyone built" and "who won"
- Source: OpenAPI spec + Riot docs

---

## 5. All Supported Regions

Based on Riot API documentation and community sources:

### Routing Values (for API calls):
- **americas**: NA1, BR1, LA1, LA2
- **asia**: KR, JP
- **europe**: EUW1, EUN1, TR1, RU
- **sea**: OC1, PH2, SG2, TH2, TW2, VN2

### All Active League of Legends Servers (Taglines):
| Tagline | Region | Notes |
|---------|--------|-------|
| NA1 | North America |  |
| EUW1 | Europe West |  |
| EUN1 | Europe Nordic & East |  |
| KR | Korea |  |
| JP | Japan |  |
| BR1 | Brazil |  |
| LA1 | Latin America North |  |
| LA2 | Latin America South |  |
| OC1 | Oceania |  |
| TR1 | Turkey |  |
| RU | Russia |  |
| PH2 | Philippines |  |
| SG2 | Singapore |  |
| TH2 | Thailand |  |
| TW2 | Taiwan, Hong Kong, Macau |  |
| VN2 | Vietnam |  |

**Note:** The frontend/config.js currently maps regions to these routing values.

---

## 6. Rate Limits

**Development API Key (free):**
- 20 requests per second
- 100 requests per 2 minutes for some endpoints? (Need verify)

**Production API Key:**
- 500 requests per 10 seconds
- Higher limits for higher tiers

---

## 7. Common Errors & Responses

- `400 Bad Request`: Missing or invalid parameters (e.g., wrong tagLine format)
- `401 Unauthorized`: Invalid or missing API key
- `403 Forbidden`: API key does not have access to this endpoint/method
- `404 Not Found`: Summoner not found with that gameName/tagLine combination
- `429 Too Many Requests`: Rate limit exceeded (wait and retry with backoff)
- `500 Internal Server Error`: Riot API issue
- `503 Service Unavailable`: API temporarily unavailable

---

## 8. OpenAPI Spec Download

The full OpenAPI 3.0 specification is available at:
- Summoner: `https://raw.githubusercontent.com/api-evangelist/riot-games/refs/heads/main/openapi/riot-games-summoner-api-openapi.yml`
- Match: `https://raw.githubusercontent.com/api-evangelist/riot-games/refs/heads/main/openapi/riot-games-match-api-openapi.yml`
- League: `https://raw.githubusercontent.com/api-evangelist/riot-games/refs/heads/main/openapi/riot-games-league-v4-openapi.yml`

These are YAML files; can be converted to JSON if needed.

---

## Conclusion & Recommendations

1. **Required user input:** gameName (username) + tagLine (e.g., "#NA1") + region (for routing)
2. **Core workflow:** Resolve both users to PUUID → fetch matchlists → intersect → fetch match details
3. **All regions supported:** Need to expand frontend/config.js beyond NA1/EUW1/KR
4. **Alternative APIs:** op.gg/u.gg do NOT offer official public APIs for match data; they scrape or use Riot API internally. Best to use Riot API directly.
5. **Output data:** Match endpoint provides everything needed: champions, items, runes, kills/deaths/assists, win/loss, gold, duration.

**Next step for D&D:** Implement the PUUID resolution and matchlist intersection in frontend/app.js using the Riot API endpoints above.