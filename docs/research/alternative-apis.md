## Output

Status: **Partial — Blocked on missing official APIs, scraping is the only viable path for op.gg and u.gg data.**

### What changed

Created: `docs/research/alternative-apis.md` (this file). No external files changed. No JSON spec files downloaded (no official OpenAPI spec exists for op.gg or u.gg).

### Main findings

#### 1. op.gg — Official MCP Server exists; official REST API does not

- **Official MCP Server** (confirmed by opgginc GitHub repo and op.gg/open-source):
  - Endpoint: `https://mcp-api.op.gg/mcp`
  - Transport: Streamable HTTP
  - License: MIT (opgginc/opgg-mcp repo)
  - Tools available (confirmed by README.md):
    - `lol_get_champion_analysis` — champion stats, builds, counter matchups, synergies
    - `lol_get_summoner_profile` — rank, LP, champion pool
    - `lol_list_summoner_matches` — recent match history
    - `lol_get_summoner_game_detail` — detailed match info
    - `lol_get_champion_synergies` — champion synergy info
    - `lol_list_champion_details` — ability info, stats for up to 10 champions
    - `lol_list_lane_meta_champions` — lane-by-lane tiers
    - `lol_get_lane_matchup_guide` — lane matchup guides
    - `lol_list_discounted_skins` — skin discounts
  - Authentication: Streamable HTTP transport implies authentication via headers, but exact auth mechanism not fully documented in public README (likely requires an API key or token for production use).
  - The MCP server is backed by 500 Global, SBVA, DS Asset Management, Dunamu & Partners (confirmed by apis.yml).

- **No official public REST API** (confirmed by Parse.bot FAQ):
  - Source: `https://parse.bot/marketplace/af8d3064-7b2a-4b73-93cf-25db02b06646/op-gg-api`
  - Quote: "Does OP.GG have an official developer API? — OP.GG does not publish a public developer API."
  - The Parse API (9 endpoints: search_summoner, get_summoner_profile, get_summoner_ranked_stats, get_summoner_champion_stats, get_summoner_match_history, get_champion_build, get_leaderboard, etc.) is an **independent REST wrapper** over public op.gg data, not an official op.gg product.
  - Rate limits: Free tier = 5 req/min ($0/mo), Hobby = 20 req/min ($30/mo), Developer = 100 req/min ($100/mo), Team = 300 req/min ($300/mo), Company = 500 req/min ($1,000/mo).
  - Endpoint health is verified on a schedule (last verified 5h ago). Self-healing layer is advertised.

- **Community libraries / scraping tools** (not official):
  - `opgg` Python library (v3.0.0, by ShoobyDoo): `pip install opgg`, provides `op.get_summoner_profile()`, `get_match_history()`, `get_champions()`.
  - `opgg-api` npm package (v2.0.5-alpha, by miasmos): serves op.gg web pages as JSON endpoints. Not an official op.gg product.
  - `opgg-data-miner` (AgainPsychoX): Python scraper for op.gg pages.
  - `scrape.gg` (emily-yu): Python library for scraping op.gg profile and match data.

- **Can it supplement Riot API for the shared-games feature?**
  - The MCP server provides `lol_get_summoner_profile` and `lol_list_summoner_matches`, which could potentially be used to retrieve match history.
  - However, the MCP server is designed for AI agents, not for direct programmatic access in a web application. The transport is Streamable HTTP, and the authentication mechanism is not fully documented for non-MCP use.
  - The Parse REST wrapper (`op.gg-api`) provides `get_summoner_match_history` (up to 20 recent matches per call) with pagination via `ended_at` timestamp. This could supplement Riot API, but it requires a paid subscription for meaningful rate limits.
  - **Conclusion:** op.gg cannot fully replace Riot API for the shared-games feature (finding overlapping games requires both players' match IDs, which requires PUUID-based lookup on Riot API). op.gg can only supplement by providing aggregated statistics, builds, or champion analysis.

- **JSON download feasibility:**
  - No official OpenAPI/Swagger spec available for download.
  - The `opgg` Python library returns JSON objects (`.json` method on results) but this is program output, not a downloadable spec.
  - The `op.gg-api` npm package does not expose a downloadable JSON spec.
  - The MCP server README does not mention downloadable specs.

#### 2. u.gg — GraphQL endpoint exists; no official REST API

- **GraphQL endpoint** (confirmed by gist source, replay_scraper.py, and search results):
  - URL: `https://u.gg/api`
  - Transport: HTTP POST (GraphQL)
  - Query: `getRankedLeaderboard` (example from replay_scraper.py):
    ```graphql
    query getRankedLeaderboard($page: Int, $queueType: Int, $regionId: String!) {
      leaderboardPage(page: $page, queueType: $queueType, regionId: $regionId) {
        totalPlayerCount
        topPlayerMostPlayedChamp
        players {
          iconId
          losses
          lp
          overallRanking
          rank
          summonerLevel
        }
      }
    }
    ```
  - This endpoint returns leaderboard data, not individual match history.
  - The `replay_scraper.py` gist also shows queries for `get_champions_mapping`, `get_ugg_overview`, `get_ugg_patch` (from `sandbox-pokhara/ugg-parser`).
  - The `Zadag/simple-u.gg-api` provides basic champion winrate and counter data.

- **No official REST API** (confirmed by u.gg FAQ, Wombo Combo analysis):
  - Source: `https://wombocombo.gg/blog/game-analytics/ugg-analytics-explained`
  - Quote: "U.GG pulls data from the Riot Games API, the same source used by OP.GG and every other third-party League of Legends statistics platform."
  - This confirms u.gg does NOT have its own data source; it relies entirely on Riot API.

- **Can it supplement Riot API for the shared-games feature?**
  - The GraphQL endpoint (`https://u.gg/api`) is focused on leaderboard data (`getRankedLeaderboard`), champion data (`get_champions_mapping`), and tier lists (`get_ugg_overview`).
  - There is no endpoint for retrieving individual match history or finding overlapping games between two players.
  - The `get_summoner_profile` endpoint (if it exists on u.gg) is not documented in the available sources and may not exist.
  - The `replay_scraper.py` shows `pro_list` endpoint (`https://u.gg/api/pro_list/0`) for professional players.
  - **Conclusion:** u.gg cannot supplement Riot API for the shared-games feature. It provides aggregated champion statistics and leaderboards, not individual match intersection data.

- **JSON download feasibility:**
  - No official OpenAPI/Swagger spec available.
  - The GraphQL endpoint can return JSON responses (GraphQL responses are JSON by default), but the schema is not published for download.
  - The `sandbox-pokhara/ugg-parser` parses u.gg data into JSON format programmatically, but this requires running the parser.
  - No downloadable JSON file with full API specs.

#### 3. Alternative stat sites (LeagueOfGraphs, Mobalytics, Porofessor)

- **LeagueOfGraphs** (confirmed by agatasmurf.com and leagueofgraphs.com):
  - Uses Riot Games API directly (live updates).
  - No public API endpoint documented for match history.
  - Provides aggregate statistics (champion win rates, rankings) but no shared-game feature.
  - URL pattern: `https://www.leagueofgraphs.com/summoner/<region>/<summonerName>-<tagline>`

- **Mobalytics** (confirmed by mobalytics.gg blog and Reddit):
  - Uses official Riot APIs (supplemented by Overwolf for ancillary features).
  - Recently added a side-by-side summoner comparison feature (Reddit post: "You asked we made it, comparing summoner side by side").
  - No public REST API for match history.
  - The comparison feature may show parallel stats but does not find shared games.

- **Porofessor.gg** (not researched in depth, but confirmed by existing docs):
  - Focuses on post-game analysis (items, builds, team composition).
  - No evidence of an API endpoint for shared-game lookup.

- **Can any alternative site supplement Riot API for the shared-games feature?**
  - **No.** None of the alternative sites (op.gg, u.gg, leagueofgraphs, mobalytics, porofessor) provide an endpoint for finding overlapping games between two summoners. The shared-games feature is unique to this project and requires the Riot API's PUUID-based match list intersection algorithm.
  - Alternative sites can supplement by providing aggregated statistics (champion builds, win rates, tier lists) but NOT by providing the core shared-game discovery.

---

## Learnings

- Learning: op.gg has an official MCP server but no official public REST API.
  Evidence: `README.md` at `https://github.com/opgginc/opgg-mcp/blob/main/README.md` shows endpoint `https://mcp-api.op.gg/mcp`, MIT license, and 20+ tools; `parse.bot` FAQ states "OP.GG does not publish a public developer API."
  Reuse when: Deciding whether to rely on op.gg as a data source. Use the MCP server only if you are building an AI agent; use the Parse REST wrapper (paid) or scraping for web applications.

- Learning: u.gg pulls from Riot API (same raw data) and exposes a GraphQL endpoint (`https://u.gg/api`) focused on leaderboards and champion data, not match history.
  Evidence: Replay scraper gist (`replay_scraper.py`) shows GraphQL query `getRankedLeaderboard` with parameters `page`, `queueType`, `regionId`; Wombo Combo analysis confirms u.gg uses Riot API as source.
  Reuse when: Considering u.gg as an alternative data source. It cannot replace Riot API for shared-game lookup.

- Learning: No alternative site (op.gg, u.gg, leagueofgraphs, mobalytics, porofessor) provides a shared-game intersection feature or an endpoint for retrieving overlapping match histories.
  Evidence: All researched sites focus on individual profiles, aggregate statistics, leaderboards, or champion builds. None document a "find shared games between two players" endpoint.
  Reuse when: Confirming that the shared-games feature is unique and requires direct Riot API integration.

- Learning: JSON spec download is not available for op.gg (no OpenAPI spec) or u.gg (GraphQL schema not published as downloadable JSON file).
  Evidence: No `swagger.json`, `openapi.yaml`, or `.json` spec file found in op.gg MCP repo, Parse API docs, u.gg source code, or web search results.
  Reuse when: Planning API integration documentation. You must rely on the official Riot API docs and reverse-engineer alternative site endpoints through scraping or community libraries.

---

## What remains unresolved

1. **op.gg MCP server authentication details:** The exact authentication mechanism (API key format, header name, token expiration) is not fully documented in the public README. This needs to be verified by testing against the endpoint or contacting op.gg.
2. **Rate limits for op.gg MCP server:** Not explicitly stated in the README. Must be tested empirically.
3. **JSON spec for op.gg or u.gg:** Not available. Must rely on scraping or community libraries (`OPGG.py`, `ugg-parser`).
4. **Shared-game intersection algorithm:** No existing endpoint provides this. Must be built using Riot API (PUUID → match list intersection).
5. **All region support:** Confirmed that Riot API supports all regions, but the exact routing parameters and region codes must be verified against the official Riot docs.
