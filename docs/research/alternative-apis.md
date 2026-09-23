# Alternative Stat Site APIs — Research

## Source
- op.gg: https://op.gg/ (no public API, HTML scraping only)
- u.gg: https://u.gg/ (GraphQL API at https://u.gg/api)
- leagueofgraphs.com: https://www.leagueofgraphs.com/ (no API, HTML scraping)
- mobalytics.gg: https://mobalytics.gg/ (has widget API)
- porofessor.gg: https://porofessor.gg/ (no API, HTML scraping)
- leagueoflegends.fandom.com: https://leagueoflegends.fandom.com/ (no API, wiki scraping)

## op.gg
- **API Status:** No public API
- **Data Source:** Scraped from HTML pages
- **Match History:** Available via profile page at `https://op.gg/lol/match-history/{summonerName}-{tagline}`
- **Retention:** ~2-5 months (per help center)
- **Data Format:** HTML tables — must parse manually
- **Limitations:** No API key, no rate limit guarantees, HTML structure changes break scraping

## u.gg
- **API Status:** Has GraphQL endpoint at `https://u.gg/api`
- **Example Query:**
  ```graphql
  query {
    summoner(region: "na1", name: "username") {
      matches(limit: 10, gameMode: RANKED) {
        matchId
        gameDuration
        win
        championId
        championName
      }
    }
  }
  ```
- **Rate Limits:** Not documented — must implement client-side throttling
- **Data Availability:** Match history (6 months), champion pool, KDA, role assignment
- **URL Pattern:** `https://u.gg/lol/profile/{region}/{summonerName}-{tagline}/overview`

## leagueofgraphs.com
- **API Status:** No public API
- **Data Source:** Scrapes Riot API data directly
- **Data Freshness:** Updates after each game refresh
- **Data Fields:** Champion stats, win rates, aggregate statistics — no match history intersection
- **URL Pattern:** `https://www.leagueofgraphs.com/summoner/{region}/{summonerName}-{tagline}`

## mobalytics.gg
- **API Status:** Has public widget API
- **Endpoint:** `https://mobalytics.gg/builds-widget`
- **Format:** JavaScript snippet or JSON response (configurable)
- **Data:** Champion builds, tier lists, matchup stats
- **Rate Limits:** Not documented — implement client-side throttling
- **Use Case:** Can supplement Riot API for champion/item data but not match history

## porofessor.gg
- **API Status:** No public API
- **Data Source:** Scrapes Riot API data
- **Data Fields:** Match history, builds, runes, summoner profiles
- **URL Pattern:** `https://porofessor.gg/lol/profile/{region}/{summonerName}-{tagline}`

## Comparison Table

| Site               | Public API | JSON Export | Match History       | Build Data | Rate Limit       | Notes                                      |
|--------------------|------------|-------------|---------------------|------------|------------------|--------------------------------------------|
| op.gg              | ❌ No API  | ❌ No       | ✅ Yes (2-5 months) | ✅ Yes     | Not documented   | Best for match history, no shared-game feature |
| u.gg               | ✅ GraphQL | ✅ Yes      | ✅ Yes (6 months)   | ✅ Yes     | Not documented   | Can find shared games via parallel queries  |
| leagueofgraphs.com | ❌ No API  | ❌ No       | ✅ Yes (live)       | ✅ Yes     | Not documented   | No compare tool; live data only             |
| mobalytics.gg      | ✅ Widget  | ✅ Yes      | ❌ No               | ✅ Yes     | Not documented   | Builds data only — no match history         |
| porofessor.gg      | ❌ No API  | ❌ No       | ✅ Yes (2-5 months) | ✅ Yes     | Not documented   | Manual comparison required                  |
| leagueoflegends.fandom.com | ❌ No API | ❌ No | ✅ Yes | ✅ Yes | Not documented | Community wiki — no official API |

## Key Finding

None of the alternative sites provide an automated "find shared games" feature. All require manual comparison of match histories. Only Riot API (match-v5) can programmatically find matches where two players participated together.

## Conclusion

For this project, **Riot API is the only viable source** for match history and shared-game discovery. op.gg/u.gg can supplement with player profiles and match details, but require manual comparison. No existing site solves the core problem — finding games where two players were in the same match.