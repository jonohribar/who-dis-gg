# Alternative APIs & Stat Sites — Research

**Date:** 2026-09-23

---

## 1. OP.GG

**Source:** https://github.com/opgginc/opgg-mcp/blob/main/README.md

OP.GG has released an official **MCP Server** that provides AI agents access to OP.GG game data.

**Endpoint:** `https://mcp-api.op.gg/mcp` (Streamable HTTP transport)

**Available Tools:**
| Tool | Description |
|------|-------------|
| `lol_get_summoner_profile` | Summoner profile with rank, tier, LP, win rate, champion pool |
| `lol_get_summoner_game_detail` | Detailed information for a specific game (all players) |
| `lol_list_summoner_matches` | Recent match history with per-game stats |
| `lol_get_champion_analysis` | Champion stats (win/pick/ban rates), optimal builds (items, runes, skills, spells), counters |
| `lol_get_champion_build` | Current-patch rune pages, item sets, skill orders, counters |

**Assessment:** OP.GG's MCP server provides structured access to match history and summoner data. This is a **structured API** (not scraping) but requires MCP protocol integration. It could supplement Riot API for detailed match data and champion builds.

**Third-party option:** Parse.bot offers an OP.GG API wrapper with 9 endpoints covering summoner data, champion performance, and ranked leaderboards.

---

## 2. U.GG

**Source:** https://u.gg/ (site inspection)

U.GG provides:
- Summoner profiles with match history
- Champion builds and runes
- Ranked statistics
- **Multisearch** — compare multiple summoners side-by-side

**API Status:** No official public API found. U.GG appears to use the Riot API internally and serves data via their website.

**Potential:** U.GG's pro player endpoint (`/pro_list/0`) has been referenced in community code. This is not an official API and should not be relied upon for production.

---

## 3. LeagueOfGraphs

**Source:** https://www.leagueofgraphs.com/

LeagueOfGraphs:
- Pulls live ranked data from the Riot Games API
- Updates stats after each game
- Focuses on champion and aggregate statistics
- No explicit player-comparison or shared-games feature found

**API Status:** No public API found. Data is served via website.

---

## 4. Mobalytics

**Source:** https://mobalytics.gg/blog/lol-mobalytics-beginners-guide/

Mobalytics:
- Overview tab with match history and insights
- Recently added side-by-side summoner comparison
- Uses official Riot APIs for core game data

**API Status:** No public API found. Data is served via website.

---

## 5. Comparison Table

| Site | Public API | JSON Download | Match History | Player Comparison | Shared Games Feature | Riot API Used |
|------|------------|---------------|---------------|-------------------|----------------------|---------------|
| **Riot API** | ✅ Yes (official) | ✅ OpenAPI spec | ✅ Yes | ❌ No | ✅ Yes (via intersection) | ✅ Yes |
| **OP.GG** | ⚠️ MCP Server | ⚠️ Via MCP | ✅ Yes | ✅ Yes (multisearch) | ❌ No | ✅ Yes |
| **U.GG** | ❌ No | ❌ No | ✅ Yes | ✅ Yes (multisearch) | ❌ No | ✅ Yes |
| **LeagueOfGraphs** | ❌ No | ❌ No | ✅ Yes | ❌ No | ❌ No | ✅ Yes |
| **Mobalytics** | ❌ No | ❌ No | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |

---

## 6. Recommendation

**Primary:** Use the **Riot API** directly. It is:
- Official and documented
- Free for personal projects (development key)
- Provides all data needed for the shared-games feature
- Has a machine-readable OpenAPI spec
- Supports all regions via PUUID

**Secondary:** Use **OP.GG MCP** as a supplement for:
- Champion analysis
- Champion builds
- Counter data
- Enhanced match detail display

**Avoid:** Scraping U.GG, LeagueOfGraphs, or Mobalytics. They don't expose public APIs and their internal endpoints are undocumented.

**Conclusion:** The shared-games feature is fully achievable with the Riot API alone. No third-party stat site is required for the core functionality.
