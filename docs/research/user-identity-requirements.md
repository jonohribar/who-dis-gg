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
- **tagLine** = the server/region identifier (e.g., `NA1`, `EUW1`, `KR`)

The tagLine is **both** a region identifier **and** part of the Riot ID.

---

## 2. What the User Must Provide

| Field | Required? | Example | Notes |
|-------|-----------|---------|-------|
| **Player A gameName** | ✅ Yes | `Faker` | In-game display name |
| **Player A tagLine** | ✅ Yes | `NA1` | Riot ID tag = region |
| **Player B gameName** | ✅ Yes | `T1_Zeus` | In-game display name |
| **Player B tagLine** | ✅ Yes | `NA1` | Riot ID tag = region |

**No separate region dropdown is needed** — the tagLine already encodes the region.

---

## 3. Riot Identifiers Explained

| Identifier | Length | Example | Used For |
|------------|--------|---------|----------|
| **Riot ID** | variable | `Faker#NA1` | User-facing display |
| **PUUID** | 78 chars | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` | All game-specific API calls |
| **Summoner ID** | variable | `encrypted_summoner_id` | Legacy, deprecated |
| **Account ID** | variable | `encrypted_account_id` | Legacy, deprecated |

---

## 4. All Supported Regions (Taglines)

| Tagline | Region | Platform Host |
|---------|--------|---------------|
| `NA1` | North America | `na1.api.riotgames.com` |
| `BR1` | Brazil | `br1.api.riotgames.com` |
| `LA1` | Latin America North | `la1.api.riotgames.com` |
| `LA2` | Latin America South | `la2.api.riotgames.com` |
| `EUW1` | Europe West | `euw1.api.riotgames.com` |
| `EUN1` | Europe Nordic & East | `eun1.api.riotgames.com` |
| `TR1` | Turkey | `tr1.api.riotgames.com` |
| `RU` | Russia | `ru.api.riotgames.com` |
| `KR` | Korea | `kr.api.riotgames.com` |
| `JP1` | Japan | `jp1.api.riotgames.com` |
| `OC1` | Oceania | `oc1.api.riotgames.com` |
| `PH2` | Philippines | `ph2.api.riotgames.com` |
| `SG2` | Singapore | `sg2.api.riotgames.com` |
| `TH2` | Thailand | `th2.api.riotgames.com` |
| `TW2` | Taiwan | `tw2.api.riotgames.com` |
| `VN2` | Vietnam | `vn2.api.riotgames.com` |
| `ME1` | Middle East | `me1.api.riotgames.com` |

**17 regions total.** The prototype's current 3-region dropdown (NA1, EUW1, KR) needs to be expanded to all 17.

---

## 5. API Resolution Flow

```
User Input: Faker#NA1
    ↓
GET /riot/account/v1/accounts/by-riot-id/Faker/NA1
    ↓
Response: { puuid: "a1b2c3d4-...", gameName: "Faker", tagLine: "NA1" }
    ↓
GET /lol/summoner/v4/summoners/by-puuid/{puuid}
    ↓
Response: { id: "encrypted_summoner_id", name: "Faker", region: "NA1", ... }
    ↓
GET /lol/match/v5/matches/by-puuid/{puuid}/ids
    ↓
Response: ["_1234567890", "_9876543210", ...]
    ↓
GET /lol/match/v5/matches/{matchId}
    ↓
Response: { participants: [...], info: {...}, metadata: {...} }
```

---

## 6. Key Insight

**The tagLine IS the region.** No separate region field is needed. The user just needs to provide their full Riot ID (username#tagline) for both players.

**Implementation note:** The prototype's current design has a separate region dropdown (NA1, EUW1, KR). This should be updated to:
- Option A: Replace dropdown with a tagline input field (e.g., "NA1", "EUW1", "KR")
- Option B: Keep dropdown but make it optional (tagline takes precedence)

**Recommendation:** Option A — tagline input field. It's simpler and matches the Riot ID format.