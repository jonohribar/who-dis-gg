# Riot Games API — Exact Endpoints & Regions

**Source:** https://developer.riotgames.com/docs/lol (official documentation)
**Date:** 2026-09-23

---

## 1. Summoner Identity Flow

Riot transitioned from **Summoner Names** to **Riot ID** (gameName + tagLine) as the authoritative player identifier. As of Nov 2023, the system uses:

- **Riot ID** = `gameName` + `tagLine` (e.g., `Faker#NA1`, where `NA1` is the tagLine)
- **PUUID** = encrypted 78-char identifier (used for all game-specific API calls)
- **Summoner ID** = internal encrypted summoner ID

### Step 1: Riot ID → PUUID

**Endpoint:** `GET /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}`

**Routing values:** `americas`, `asia`, `europe` (nearest cluster)

**Headers:** `Authorization: Bearer {API_KEY}`

**Sample Response:**
```json
{
  "puuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "gameName": "Faker",
  "tagLine": "NA1",
  "summonerID": "encrypted_summoner_id",
  "profileIconId": 1234,
  "revisionDate": 1234567890000,
  "summonerLevel": 500
}
```

### Step 2: PUUID → Summoner Profile

**Endpoint:** `GET /lol/summoner/v4/summoners/by-puuid/{encryptedPUUID}`

**Sample Response:**
```json
{
  "id": "encrypted_summoner_id",
  "accountId": "encrypted_account_id",
  "puuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Faker",
  "profileIconId": 1234,
  "revisionDate": 1234567890000,
  "summonerLevel": 500,
  "championId": 266,
  "championName": "Aatrox",
  "kills": 1200,
  "deaths": 400,
  "assists": 800,
  "totalGoldEarned": 15000000,
  "win": true,
  "teamId": 100,
  "teamPosition": "TOP",
  "region": "NA1"
}
```

### Step 3: PUUID → Match History

**Endpoint:** `GET /lol/match/v5/matches/by-puuid/{puuid}/ids`

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `puuid` | string | Required — encrypted PUUID |
| `queue` | integer | Filter by queue ID (420 = Ranked Solo, 440 = Ranked Flex, etc.) |
| `type` | string | Filter by game type (Ranked, Custom) |
| `start` | integer | Pagination start index |
| `count` | integer | Max 100 match IDs per request |

**Sample Response:**
```json
["_1234567890", "_9876543210", "_5555555555", ...]
```

### Step 4: Match ID → Match Detail

**Endpoint:** `GET /lol/match/v5/matches/{matchId}`

**Sample Response (focused fields):**
```json
{
  "metadata": {
    "dataVersion": "16.18.1",
    "matchId": "_1234567890",
    "participants": ["puuid_a", "puuid_b", ...],
    "gameCreation": 1700000000000,
    "gameDuration": 1950000,
    "gameId": 1234567890,
    "gameMode": "RANKED_SOLO_5x5",
    "gameName": "League of Legends",
    "gameType": "MATCHED_GAME",
    "mapId": 11,
    "queueId": 420,
    "teams": [100, 200]
  },
  "info": {
    "endOfGameResult": "Win",
    "gameCreation": 1700000000000,
    "gameDuration": 1950000,
    "gameVersion": "16.18.1",
    "teams": [
      {
        "teamId": 100,
        "win": true,
        "firstBlood": true,
        "firstTower": true,
        "firstInhibitor": true
      }
    ]
  },
  "participants": [
    {
      "puuid": "a1b2c3d4-...",
      "summonerName": "Faker",
      "championId": 266,
      "championName": "Aatrox",
      "teamId": 100,
      "teamPosition": "TOP",
      "kills": 5,
      "deaths": 2,
      "assists": 8,
      "totalDamageDealt": 250000,
      "totalGoldEarned": 15000,
      "win": true,
      "item0": 3078,
      "item1": 3157,
      "item2": 3152,
      "item3": 3071,
      "item4": 3053,
      "item5": 3111,
      "item6": 3340,
      "rune0": 8010,
      "rune1": 9101,
      "rune2": 9104,
      "rune3": 8299,
      "perk0": 8010,
      "perk1": 9101,
      "perk2": 9104,
      "perk4": 8299,
      "perk5": 8304,
      "statPerks": {"health": 500, "m5": 6, "hprec": 1}
    }
  ]
}
```

### Reverse Lookup: PUUID → Riot ID

**Endpoint:** `GET /riot/account/v1/accounts/by-puuid/{puuid}`

**Sample Response:**
```json
{
  "gameName": "Faker",
  "tagLine": "NA1",
  "puuid": "a1b2c3d4-..."
}
```

---

## 2. All Supported Platform Regions

**Source:** https://developer.riotgames.com/docs/lol — Routing Values section

| Platform Host | Region | Tagline |
|---------------|--------|---------|
| `na1.api.riotgames.com` | North America | `NA1` |
| `br1.api.riotgames.com` | Brazil | `BR1` |
| `la1.api.riotgames.com` | Latin America North | `LA1` |
| `la2.api.riotgames.com` | Latin America South | `LA2` |
| `euw1.api.riotgames.com` | Europe West | `EUW1` |
| `eun1.api.riotgames.com` | Europe Nordic & East | `EUN1` |
| `tr1.api.riotgames.com` | Turkey | `TR1` |
| `ru.api.riotgames.com` | Russia | `RU` |
| `kr.api.riotgames.com` | Korea | `KR` |
| `jp1.api.riotgames.com` | Japan | `JP1` |
| `oc1.api.riotgames.com` | Oceania | `OC1` |
| `ph2.api.riotgames.com` | Philippines | `PH2` |
| `sg2.api.riotgames.com` | Singapore | `SG2` |
| `th2.api.riotgames.com` | Thailand | `TH2` |
| `tw2.api.riotgames.com` | Taiwan | `TW2` |
| `vn2.api.riotgames.com` | Vietnam | `VN2` |
| `me1.api.riotgames.com` | Middle East | `ME1` |

**Regional routing values** (for account-v1):
| Region | Host |
|--------|------|
| `americas` | `americas.api.riotgames.com` |
| `asia` | `asia.api.riotgames.com` |
| `europe` | `europe.api.riotgames.com` |
| `sea` | `sea.api.riotgames.com` |

**Key insight:** The tagline (e.g., `OC`, `XA58`, `NA1`) is an arbitrary account label — it is NOT the platform region identifier. The region (e.g., `OC1`, `NA1`, `EUW1`) is a separate API routing code. Both the tagline (for account-v1 lookup) and the region (for match-v5 routing) must be provided independently.

---

## 3. Rate Limits

| Key Tier | Rate Limit | Use Case |
|----------|------------|----------|
| **Development** | 20 requests/second | Personal projects, prototyping |
| **Production** | 500 requests/10 seconds | Public-facing applications |

**Headers returned:** `X-Rate-Limit-Count`, `X-Rate-Limit-Interval`

**Strategy for shared-games feature:**
- 2 PUUID lookups (1 per player)
- 2 match list fetches (1 per player, ~100 matches each)
- N match detail fetches (N = overlapping matches, typically 1-10)
- **Total per search: ~5-15 requests** — well within 20 req/sec development limit

---

## 4. Common Errors

| Error Code | Meaning | Action |
|-----------|---------|--------|
| 400 | Bad request | Check parameters (puuid format, matchId format) |
| 401 | Unauthorized | API key missing or invalid |
| 403 | Forbidden | Rate limit exceeded |
| 404 | Not found | Summoner name doesn't exist, matchId invalid |
| 429 | Too many requests | Rate limit exceeded, wait and retry |

---

## 5. Data Dragon (Static Game Data)

**URLs:**
- Champions: `https://ddragon.leagueoflegends.com/cdn/{version}/data/{locale}/champion.json`
- Items: `https://ddragon.leagueoflegends.com/cdn/{version}/data/{locale}/item.json`
- Runes: `https://ddragon.leagueoflegends.com/cdn/{version}/data/{locale}/runesReforged.json`
- Summoner spells: `https://ddragon.leagueoflegends.com/cdn/{version}/data/{locale}/summoner.json`
- Latest: `https://ddragon.leagueoflegends.com/cdn/dragontail-16.18.1.tgz`
- Versions: `https://ddragon.leagueoflegends.com/api/versions.json`

**Use for:** Converting champion IDs, item IDs, and rune IDs from match detail to human-readable names.

---

## 6. JSON Download / OpenAPI Spec

Riot Games publishes an **OpenAPI specification** for all their APIs:
- **Source:** https://apis.io/apis/riot-games/riot-games-match-api/
- **Format:** OpenAPI YAML (machine-readable)
- **Also available at:** https://developer.riotgames.com/apis
- **Raw spec:** https://raw.githubusercontent.com/api-evangelist/riot-games/refs/heads/main/openapi/riot-games-match-api-openapi.yml

The full API spec can be downloaded as YAML/JSON from the APIs.io site and the GitHub repository.

---

## 7. Deprecated Endpoints (Do NOT Use)

These endpoints are deprecated and will be removed:
- `GET /lol/summoner/v4/summoners/by-name/{summonerName}` — deprecated in favor of Riot ID
- `GET /tft/summoner/v1/summoners/by-name/{summonerName}` — deprecated

Use `GET /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}` instead.
