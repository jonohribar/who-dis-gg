# Riot Games API Research

## Overview

The Riot Games Developer API (v4/v5) provides access to League of Legends game data including summoner profiles, champion mastery, ranked standings, match history, and live spectator data.

## Key Endpoints for This Project

### 1. Account Lookup (Get PUUID from Riot ID)
**Endpoint:** `GET /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}`

**Purpose:** Convert a player's Riot ID (gameName + tagLine) to their encrypted PUUID.

**Response Fields:**
- `puuid` – Encrypted PUUID (78 chars) – used for all subsequent game-specific API calls
- `gameName` – The game name (e.g., "League of Legends")
- `tagLine` – Tagline (e.g., "NA1")
- `summonerID` – Internal summoner ID
- `profileIconId` – Profile icon ID
- `revisionDate` – Last revision timestamp
- `summonerLevel` – Summoner level

**Usage:** This is the first step to get a player's PUUID from their Riot ID.

### 2. Summoner Lookup (Get Player Data by PUUID)
**Endpoint:** `GET /lol/summoner/v4/summoners/by-puuid/{encryptedPUUID}`

**Purpose:** Retrieve a summoner's full profile using their PUUID.

**Response Fields:**
- `id` – Encrypted summoner ID
- `accountId` – Account ID
- `puuid` – Encrypted PUUID (same as lookup input)
- `name` – Summoner name (deprecated)
- `profileIconId` – Profile icon ID
- `revisionDate` – Last revision timestamp
- `summonerLevel` – Summoner level
- `championId` – Primary champion ID
- `championName` – Primary champion name
- `kills` – Total kills
- `deaths` – Total deaths
- `assists` – Total assists
- `totalGoldEarned` – Total gold earned
- `win` – Whether they won their last match
- `teamId` – Team ID
- `teamPosition` – Position in their team
- `region` – Region (e.g., "NA1")

**Use Case:** Once we have both players' PUUIDs, we can fetch their summoner profiles to get their names, ranks, and other stats.

### 3. Match Lookup (Get Match Details)
**Endpoint:** `GET /lol/match/v5/matches/{matchId}`

**Purpose:** Retrieve detailed information about a specific match.

**Response Fields:**
- `metadata` – Match metadata (dataVersion, matchId, participants, gameCreation, gameDuration, gameId, gameMode, gameName, gameType, mapId, queueId, teams)
- `info` – Match info (endOfGameResult, gameCreation timestamp)
- `participants` – Array of participant objects (each with `puuid`, `summonerName`, `championId`, `championName`, `kills`, `deaths`, `assists`, `totalDamageDealt`, `goldEarned`, `win`, `teamId`, `teamPosition`)
- `platformId` – Platform identifier
- `teams` – Array of teams (each with teamId, teamPosition, members)

**Key Fields for Our Use Case:**
- `participants` – Contains `puuid` and `summonerName` for each player
- `gameDuration` – Duration in milliseconds
- `gameMode` – Match type (e.g., "SoloQueue", "DuoQueue", "Ranked", "Custom")
- `gameName` – The game name (e.g., "League of Legends")
- `endOfGameResult` – Match outcome ("Win", "Loss", "Draw")
- `totalDamageDealt` – Total damage dealt by the player
- `goldEarned` – Gold earned in the match
- `win` – Boolean indicating if the player won

**Use Case:** For each pair of players, we can:
1. Get both players' summoner profiles (to get their names and ranks)
2. Get matches for each player
3. Find matches where both players appear in the `participants` array
4. For each matching match, retrieve match details (results, builds, damage, etc.)

### 4. Match List by PUUID (Alternative Approach)
**Endpoint:** `GET /lol/match/v5/matches/by-puuid/{puuid}/ids`

**Purpose:** Get a list of match IDs played by a specific player.

**Parameters:**
- `puuid` – Required (player's encrypted PUUID)
- `queue` – Filter by queue ID (e.g., 1 = Solo Queue, 2 = Duo Queue, etc.)
- `type` – Filter by game type (e.g., "Ranked", "Custom")
- `start` – Start index for pagination
- `count` – Number of match IDs to return (max 100)

**Response:** Array of match IDs (strings).

**Use Case:** This is a simpler alternative to checking matches one by one. We can get all matches for a player and then intersect with the other player's matches.

## Workflow for the User's Problem

Given two usernames (e.g., "me" and "friend"):

1. **Convert usernames to Riot IDs:**
   - Call `/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}` for each username
   - Extract the `puuid` from the response

2. **Get player summoner profiles:**
   - Call `/lol/summoner/v4/summoners/by-puuid/{puuid}` for each PUUID
   - Get `summonerName`, `level`, `championId`, `kills`, `deaths`, `assists`, etc.

3. **Find matches they played together:**
   - Option A (iterative): For each match of Player A, check if Player B's `puuid` is in the `participants` array of that match.
   - Option B (list-based): Get all match IDs for Player A via `/lol/match/v5/matches/by-puuid/{puuid}/ids`, then for each match ID, fetch match details and check participants.

4. **For each matching match, retrieve detailed info:**
   - Call `/lol/match/v5/matches/{matchId}` to get:
     - `gameName`, `gameMode`, `gameDuration`
     - `participants` array (with `puuid` and `summonerName`)
     - `endOfGameResult` (win/loss/draw)
     - `totalDamageDealt`, `goldEarned`
     - `teams` array (for team composition)

5. **Present results to the user:**
   - List of shared games with:
     - Game name and mode
     - Date/time (from `gameCreation`)
     - Winner
     - Final score (if available)
     - Builds (champions, items, runes)
     - Damage dealt and gold earned

## Rate Limits & Access

| Key Type | Rate Limit |
|----------|------------|
| Development API Key | 20 requests/second |
| Personal API Key | 20 requests/second |
| Production API Key | 500 requests/10 seconds |

**Personal keys** are ideal for prototyping since they have generous limits and are free. **Production keys** are needed for public-facing products.

## Key Challenges

1. **Player Identification:** Usernames → Riot ID conversion requires the `/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}` endpoint. This is the first hurdle.

2. **Match Intersection:** Finding matches where both players participated requires either:
   - Iterating through one player's matches and checking the other player's presence in the `participants` array
   - Or getting match IDs for both players and intersecting sets

3. **Data Granularity:** The match API returns detailed build data (champions, items, runes, damage, gold) which is exactly what the user wants to see.

4. **Regional Differences:** Matches are tied to region routing (NA1, EUW1, KR, etc.). The API handles this automatically based on the request origin.

## Summary

The Riot Games API is well-suited for this project. It provides:
- **Player identification** (Riot ID → PUUID) via account-v1 and summoner-v4
- **Match history** with participant lists via match-v5
- **Detailed match data** (results, builds, damage, gold) via match-v5
- **Free tier** for personal projects (20 req/sec)

The core algorithm is straightforward:
1. Resolve usernames to PUUIDs
2. Get summoner profiles for context
3. Find overlapping matches
4. Present match details to the user

This is a feasible and well-documented approach. The next step is to create the project structure and implement the basic workflow.
