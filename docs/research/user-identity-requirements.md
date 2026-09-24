# User Identity Requirements — Riot Account

**Source:** https://developer.riotgames.com/docs/lol (Summoner Names to Riot IDs section)
**Date:** 2026-09-23

---

## 1. Riot Account Identity

Riot accounts use a **Riot ID** format:

```
Riot ID = gameName + tagLine
Example: Faker#NA1
```

- **gameName** = the in-game display name (e.g., `Faker`, `T1_Zeus`)
- **tagLine** = the server/region identifier (e.g., `NA1`, `EUW1`, `KR`, `EUN1`)

---

## 2. What the User Must Provide

| Field | Required? | Example | Notes |
|-------|-----------|---------|-------|
| **Player A Riot ID** | ✅ Yes | `Faker#NA1` | Paste directly from League client |
| **Player A Region** | ✅ Yes | `americas` | API routing region (dropdown) |
| **Player B Riot ID** | ✅ Yes | `T1_Zeus#NA1` | Paste directly from League client |
| **Player B Region** | ✅ Yes | `americas` | API routing region (dropdown) |

**Two separate inputs per player:** a combined Riot ID field (name#tagline) + a region dropdown for API routing.

---

## 3. Riot Identifiers Explained

| Identifier | Length | Example | Used For |
|------------|--------|---------|----------|
| **Riot ID** | variable | `Faker#NA1` | User-facing display |
| **PUUID** | 78 chars | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` | All game-specific API calls |
| **Summoner ID** | variable | `encrypted_summoner_id` | Legacy, deprecated |
| **Account ID** | variable | `encrypted_account_id` | Legacy, deprecated |

---

## 4. All Supported Regions (Taglines + Routing Regions)

| Tagline | Region | Routing Region | Platform Host |
|---------|--------|----------------|---------------|
| `NA1` | North America | americas | `na1.api.riotgames.com` |
| `BR1` | Brazil | americas | `br1.api.riotgames.com` |
| `LA1` | Latin America North | americas | `la1.api.riotgames.com` |
| `LA2` | Latin America South | americas | `la2.api.riotgames.com` |
| `OC1` | Oceania | americas | `oc1.api.riotgames.com` |
| `EUW1` | Europe West | europe | `euw1.api.riotgames.com` |
| `EUN1` | Europe Nordic & East | europe | `eun1.api.riotgames.com` |
| `TR1` | Turkey | europe | `tr1.api.riotgames.com` |
| `RU` | Russia | europe | `ru.api.riotgames.com` |
| `KR` | Korea | asia | `kr.api.riotgames.com` |
| `JP1` | Japan | asia | `jp1.api.riotgames.com` |
| `SG2` | Singapore | sea | `sg2.api.riotgames.com` |
| `PH2` | Philippines | sea | `ph2.api.riotgames.com` |
| `TH2` | Thailand | sea | `th2.api.riotgames.com` |
| `TW2` | Taiwan | sea | `tw2.api.riotgames.com` |
| `VN2` | Vietnam | sea | `vn2.api.riotgames.com` |

**16 regions total** (ME1 not yet supported).

---

## 5. API Resolution Flow

```
User Input: Faker#NA1 (Riot ID) + americas (routing region)
    ↓
Parse: gameName="Faker", tagLine="NA1"
    ↓
GET /riot/account/v1/accounts/by-riot-id/Faker/NA1  (uses tagline)
    ↓
Response: { puuid: "a1b2c3d4-...", gameName: "Faker", tagLine: "NA1" }
    ↓
GET /lol/match/v5/matches/by-puuid/{puuid}/ids?count=100  (uses routing region: americas)
    ↓
Response: ["NA1_1234567890", "NA1_9876543210", ...]
    ↓
GET /lol/match/v5/matches/{matchId}  (uses same routing region)
    ↓
Response: { participants: [...], info: {...}, metadata: {...} }
```

---

## 6. Key Clarification: Tagline ≠ Routing Region

| Concept | Example | Used For |
|---------|---------|----------|
| **Tagline** | `NA1`, `EUW1`, `EUN1`, `KR` | Account lookup: `/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}` |
| **Routing Region** | `americas`, `europe`, `asia`, `sea` | Match history: `/lol/match/v5/matches/by-puuid/{puuid}/ids` |

The tagline identifies the **server** (shard) where the account lives.
The routing region identifies the **API shard** for match data.
Multiple taglines map to the same routing region (e.g., NA1, BR1, LA1, LA2, OC1 → americas).

---

## 7. Implementation Design

The UI provides **per-player**:
1. **Riot ID input** (single field, format `name#tagline`) — parsed client-side
2. **Region dropdown** (americas/europe/asia/sea) — for API routing

This avoids the earlier design bug where tagline was incorrectly used as the routing region.

**Tagline validation:** Must be one of the 16 supported values above.
**Routing region validation:** Must be one of: americas, europe, asia, sea.
**Compatibility check:** Tagline must map to the selected routing region (e.g., NA1 → americas).