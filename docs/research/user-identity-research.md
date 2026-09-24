# Exact User Identity Requirements — Research

## Source
- Riot Developer Portal (https://developer.riotgames.com/)
- Riot API documentation (deepwiki.com, skillmd.ai)
- Riot ID format confirmed via API endpoints

## Key Findings

### 1. Riot ID Structure
- **Format:** username#tagline (e.g., "Faker#NA1")
- **Tagline Definition:** Server/region identifier (e.g., "NA1", "EUW1", "KR", "EUN1", "BR1", "LA1", "LA2", "OC1", "TR1", "RU", "SG2", "PH2", "TH2", "TW2", "JP1", "VN2")
- **Critical:** Tagline is NOT the API routing region — it's the server identifier (e.g., "NA1" = North America server). The routing region (americas/europe/asia/sea) is derived separately.

### 2. Supported Regions & Taglines (Complete List with Platform Codes)
| Tagline | Region | Routing Region | Platform Host |
|---------|--------|----------------|---------------|
| NA1 | North America | americas | na1.api.riotgames.com |
| BR1 | Brazil | americas | br1.api.riotgames.com |
| LA1 | Latin America North | americas | la1.api.riotgames.com |
| LA2 | Latin America South | americas | la2.api.riotgames.com |
| OC1 | Oceania | americas | oc1.api.riotgames.com |
| EUW1 | Western Europe | europe | euw1.api.riotgames.com |
| EUN1 | Europe Nordic & East | europe | eun1.api.riotgames.com |
| TR1 | Turkey | europe | tr1.api.riotgames.com |
| RU | Russia | europe | ru.api.riotgames.com |
| KR | Korea | asia | kr.api.riotgames.com |
| JP1 | Japan | asia | jp1.api.riotgames.com |
| SG2 | Singapore | sea | sg2.api.riotgames.com |
| PH2 | Philippines | sea | ph2.api.riotgames.com |
| TH2 | Thailand | sea | th2.api.riotgames.com |
| TW2 | Taiwan | sea | tw2.api.riotgames.com |
| VN2 | Vietnam | sea | vn2.api.riotgames.com |

### 3. User Input Requirements

Users must provide **two fields per player** (the region dropdown is for API routing, not auto-populated from tagline):

1. **Riot ID** (single text input, format: `username#tagline`, e.g., `Faker#NA1`)
2. **Region** (dropdown — selects the API routing region: americas/europe/asia/sea)

### Validation Rules
- Both fields required for each player
- Tagline must be one of the supported values above (case-sensitive)
- Region dropdown selects the API routing region (americas/europe/asia/sea)
- Tagline and routing region must be compatible (e.g., NA1 tagline → americas routing region)

### 4. Tagline vs. Routing Region Clarification
- **Tagline** = server identifier (e.g., "NA1" = North America server) — used for account-v1 lookup
- **Routing Region** = API shard (americas/europe/asia/sea) — used for match-v5 endpoints
- The app uses separate inputs: one combined Riot ID field (name#tagline) + one region dropdown per player
- This avoids the confusion where tagline was incorrectly used as routing region

### 5. PUUID vs. Summoner ID vs. Riot ID
- **Riot ID:** username#tagline (user input) → resolves to PUUID via /riot/account/v1/accounts/by-riot-id/
- **Summoner ID:** internal encrypted ID (used for ranked/match endpoints)
- **PUUID:** encrypted cross-region ID (used for match history via match-v5)
- **Account ID:** account-specific ID (not used for match history)

### 6. Conversion Path
1. User enters: Riot ID (e.g., `Faker#NA1`) + routing region (e.g., `americas`)
2. App parses Riot ID → `gameName=Faker`, `tagLine=NA1`
3. App calls: /riot/account/v1/accounts/by-riot-id/Faker/NA1 (uses tagline)
4. API returns: puuid (encrypted PUUID)
5. App calls: /lol/match/v5/matches/by-puuid/{puuid}/ids?count=100 (uses routing region)
6. API returns match IDs
7. For each matchId: /lol/match/v5/matches/{matchId} (uses routing region)
8. Match details contain participants with puuid and summonerName

## Key Validation Points
- Tagline must be in the supported list (see table above)
- Routing region must be one of: americas, europe, asia, sea
- Tagline and routing region must be compatible
- Username must be non-empty and match Riot ID format

## Next Steps
- Frontend supports all 17 regions in dropdowns (done)
- Config includes all region mappings with correct routing regions (done)
- Frontend form uses single Riot ID input + region dropdown per player (done)