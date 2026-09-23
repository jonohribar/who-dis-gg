# Existing Stat Sites Research

## Overview

Research into op.gg, u.gg, leagueofgraphs.com, mobalytics.gg, porofessor.gg, and other League of Legends stat sites to understand their capabilities and data sources.

## Sites Analyzed

### op.gg
- **URL:** https://op.gg/summoners/
- **Features:** Match history, champion builds, runes, stats, ranked overview
- **API:** No public API; relies on Riot API data cached on their servers
- **Pros:** Most popular site, comprehensive data
- **Cons:** No "find shared games" feature; no public API

### u.gg
- **URL:** https://u.gg/summoners/
- **Features:** Match history, builds, runes, ranked overview
- **API:** No public API; relies on Riot API data
- **Pros:** Clean interface, good for builds
- **Cons:** No shared games feature; no public API

### leagueofgraphs.com
- **URL:** https://www.leagueofgraphs.com/summoners/
- **Features:** Detailed stats, match history, ranked overview
- **API:** Provides a public API (limited) for stat queries
- **Pros:** Has an API; detailed stats
- **Cons:** Rate-limited; no shared games feature

### mobalytics.gg
- **URL:** https://www.mobalytics.com/summoners/
- **Features:** Match history, builds, runes, ranked overview, improvement reports
- **API:** No public API; relies on Riot API data
- **Pros:** Good analysis tools
- **Cons:** No shared games feature; no public API

### porofessor.gg
- **URL:** https://porofessor.gg/summoners/
- **Features:** Match history, builds, runes, ranked overview
- **API:** No public API; relies on Riot API data
- **Pros:** Overlay for in-game use
- **Cons:** No shared games feature; no public API

## Key Finding

**No existing site offers a "find which game two players played together" feature.** This is the gap our project fills.

## Recommended Approach

1. **Rely on Riot's official API** as the primary data source (free, comprehensive, official)
2. **Link to op.gg/u.gg** for detailed match views (they have the best UI for builds/runes)
3. **Use leagueofgraphs API** as a fallback for stat queries if needed

## Data Sources Summary

| Source | Type | Access | Best For |
|--------|------|--------|----------|
| Riot Developer API | Official | Free (personal key) | Match history, player data, match details |
| op.gg | Third-party | Web only | Detailed match views, builds, runes |
| u.gg | Third-party | Web only | Detailed match views |
| leagueofgraphs | Third-party | Public API (limited) | Stat queries |

## Recommendation

Start with the Riot API only. Use external links (op.gg/u.gg) for detailed match views. This keeps the project simple, free, and maintainable.
