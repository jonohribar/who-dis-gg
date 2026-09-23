# Alternative APIs — op.gg, u.gg, and Stat Sites (whodis_gg-rhg + whodis_gg-hw3)

**Status:** Partial
**Source:** Web research (u.gg FAQ, GitHub repos, op.gg scraper npm, Wombo Combo analysis)
**Date:** 2026-09-23

---

## 1. op.gg API — Verdict: No Public API (scraping only)

**Findings:**
- No official developer portal or public REST API for op.gg
- The `opgg-scraper` npm package exists as a community project — it scrapes op.gg pages and returns JSON-like data
- op.gg derives all its data from Riot's API internally (confirmed via op.gg Help Center docs: "All summoner stats on OP.GG are provided through official Riot Games API data")
- op.gg's "Multi-Search" feature (https://op.gg/multi-search) allows comparing multiple players on one page — the closest feature to what whodis.gg wants, but it's a web UI, not an API

**Relevant URLs:**
- https://op.gg/multi-search (player comparison UI)
- https://op.gg/lol/summoners/{region}/{summonerName}-{tagline} (player profile URL)
- https://www.npmjs.com/package/opgg-scraper (community scraper)

**Verdict:** op.gg cannot be used as an API. Must rely on Riot's API directly and link out to op.gg for detailed views.

---

## 2. u.gg API — Verdict: GraphQL endpoint found (undocumented, TOS unclear)

**Findings:**
- u.gg uses a GraphQL endpoint at `https://u.gg/api` (from `replay_scraper.py` Gist)
- The endpoint accepts `operationName`, `query`, and `variables`
- u.gg's FAQ states: "U.GG pulls data from the Riot Games API, the same source used by OP.GG"
- No public developer portal exists
- Community projects exist: `simple-u.gg-api` (GitHub), `ugg-parser` (GitHub), `uggo` CLI tool
- Pro build data is available via u.gg's undocumented GraphQL — "not against their TOS to use the endpoint" per one user on Vuink.com

**Sample GraphQL call (from Gist):**
```python
leaderboard_url = "https://u.gg/api"
body = {
    "operationName": "getRankedLeaderboard",
    "query": "query getRankedLeaderboard($page: Int, $queueType: Int, $regionId: String!) { leaderboardPage(page: $page, queueType: $queueType, regionId: $regionId) { ... } }"
}
```

**Verdict:** u.gg has an undocumented GraphQL endpoint that could potentially provide champion winrates, builds, and ranked data. However, it's **not officially documented**, **no authentication**, and **terms of service unclear**. Using it in production is risky. **Not recommended for whodis.gg's core functionality.**

---

## 3. Other Stat Sites — Verdict: None have public APIs for match history

| Site | API Available? | Data Available | Notes |
|------|----------------|----------------|-------|
| leagueofgraphs.com | ❌ No public API | Champion stats only | Focuses on aggregate data, no match history |
| porofessor.gg | ❌ No public API | Profile overlay (in-client) | Browser extension, no API |
| mobalytics.gg | ❌ No public API | Match insights, LP tracking | Has a side-by-side comparison feature, but no API documented |
| leagueoflegends.fandom.com | ❌ Wiki only | Champion info, patch notes | No API |

**Source:** Research from existing-sites.md and u.gg FAQ.

**Verdict:** No alternative site provides match history data via API. Riot's API is the only viable source for the core "find shared games" feature.

---

## 4. Downloading Riot API as JSON — Verdict: Yes, possible

**Options:**
1. **OpenAPI specs on GitHub:** `raw.githubusercontent.com/api-evangelist/riot-games` contains YAML specs for summoner-api, match-api, etc. Can be converted to JSON with any YAML→JSON tool.
2. **Postman collection:** Riot API documentation on developer.riotgames.com includes "Try it" buttons that can be exported as Postman collections (JSON).
3. **Community SDKs:** `league-sdk` on GitHub, `katarem/KatApi`, `riven` (Rust) — these contain endpoint definitions in code as JSON-like data structures.

**Recommended action:** Download the OpenAPI YAML from GitHub and convert to JSON for documentation and validation. The YAML files contain full endpoint definitions with request/response schemas.

---

## 5. Summary Table — Data Sources for whodis.gg

| Source | Match History | Shared Games | Builds/Runes | Reliable | Recommended for whodis |
|--------|:---:|:---:|:---:|:---:|:---:|
| Riot API | ✅ | ✅ | ✅ | ✅ | **Primary** |
| op.gg | ✅ | ❌ | ✅ | ✅ | **Links out** |
| u.gg | ✅ | ❌ | ✅ | ⚠️ | Links out |
| leagueofgraphs | ✅ | ❌ | ✅ | ✅ | Links out |
| mobalytics | ✅ | ❌ | ✅ | ✅ | Links out |
| porofessor | ❌ | ❌ | ❌ | ✅ | N/A |

**Key conclusion:** Riot's API is the ONLY source that can solve the core problem (find shared games). op.gg/u.gg/leagueofgraphs/mobalytics can only provide additional display data and links — they cannot replace Riot's API for the shared-game feature.

---

## 6. Recommendations

1. **Primary API:** Riot Games Developer API (account-v1 + match-v5) — only source for shared games
2. **Link out:** op.gg, u.gg, leagueofgraphs for detailed views (not needed for core feature)
3. **No scraping needed** — avoid op.gg/u.gg scraping; Riot API is sufficient and official
4. **OpenAPI JSON:** Download from GitHub and convert to JSON for documentation/validation
5. **Tagline is essential** — users must provide their Riot ID (gameName + tagLine), not just username

---

## 7. Blockers

- **No direct network access** to verify undocumented u.gg GraphQL endpoint
- **op.gg scraper** npm package exists but may violate ToS — not recommended
- **u.gg endpoint** is undocumented and may change without notice
- **Riot API key required** — must register for a free dev key before integration can begin
