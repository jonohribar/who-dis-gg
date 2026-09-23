# Exact User Identity Requirements — Research

## Source
- Riot Developer Portal (https://developer.riotgames.com/)
- Riot API documentation (deepwiki.com, skillmd.ai)
- Riot ID format confirmed via API endpoints

## Key Findings

### 1. Riot ID Structure
- **Format:** username#tagline (e.g., "Faker#NA1")
- **Tagline Definition:** Server/region identifier (e.g., "NA1", "EUW1", "KR", "BR1", "LA1", "LA2", "OC1", "TR1", "RU", "SG", "PH", "TH", "TW", "JP", "VN")
- **Critical:** Tagline is NOT just the region — it's the server identifier (e.g., "NA1" = North America server)

### 2. Supported Regions & Taglines (Complete List)
- NA1: North America
- EUW1: Western Europe
- EUW: Western Europe (alternative name)
- KR: Korea
- BR1: Brazil
- LA1: Latin America
- LA2: Latin America
- OC1: Oceania
- TR1: Turkey
- RU: Russia
- SG: Singapore
- PH: Philippines
- TH: Thailand
- TW: Taiwan
- JP: Japan
- VN: Vietnam

## User Input Requirements

Users must provide **three fields per player**:

1. **Summoner Name** (text input)
2. **Tagline** (text input or dropdown — must match one of the taglines above)
3. **Region** (dropdown — should auto-populate from tagline)

### Validation Rules
- All three fields required for each player
- Tagline must be one of the supported values (case-sensitive)
- Region dropdown should auto-populate from tagline but allow manual selection
- Region must match tagline (e.g., NA1 tagline → NA region)

### 5. Tagline vs. Region Clarification
- **Tagline** = server identifier (e.g., "NA1" = North America server)
- **Region** = geographic area (North America, Europe West, etc.)
- **User can select region manually** but it must match tagline

### 5.1. PUUID vs. Summoner ID vs. Riot ID
- **Riot ID:** username#tagline (user input) → resolves to PUUID via /riot/account/v1/accounts/by-riot-id/
- **Summoner ID:** internal encrypted ID (used for ranked/match endpoints)
- **PUUID:** encrypted cross-region ID (used for match history via match-v5)
- **Account ID:** account-specific ID (not used for match history)

### 5.2. Conversion Path
1. User enters: username + tagline + region
2. App calls: /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
3. API returns: puuid (encrypted PUUID)
4. App calls: /lol/match/v5/matches/by-puuid/{puuid}/ids
5. API returns match IDs
6. For each matchId: /lol/match/v5/matches/{matchId}
7. Match details contain participants with puuid and summonerName

## Key Validation Points

- Tagline must be in the supported list (see above)
- Region dropdown should auto-populate from tagline
- Tagline must be 2-4 characters (e.g., NA1, EUW1, KR)
- Username must be non-empty and match Riot ID format

## Next Steps
- Update frontend to support all regions (currently only 3 select)
- Update config.js to include all region mappings
- Update frontend form to allow tagline input
