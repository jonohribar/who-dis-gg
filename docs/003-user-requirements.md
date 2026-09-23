# User Requirements — whodis.gg

## Pain Point

When receiving friend requests in League of Legends, I don't remember which game I played with that person. I have ~15 friend requests and don't know whether they sent the request to flame me or to genuinely be friends. Manually searching each person on op.gg/u.gg and scrolling through hundreds of games is impractical.

## Core Problem Statement

**I want to input my League Riot ID (username + tagline) plus region, AND a friend-request sender's Riot ID (username + tagline) plus region, and have the tool tell me:**

> **Important:** Riot accounts use a "username#tagline" format (e.g., "Faker#NA1"). The tagline is the server/region identifier. Both fields are required.

**Key insight:** The tagline (e.g., NA1, EUW1, KR) is part of the Riot ID, not just the region. The input must capture both.

1. **Did we ever play together?** (yes/no)
2. **If yes, which game(s)?** — the specific match(es) we shared
3. **Game details:** date, game mode, queue type, result, duration
4. **What everyone was playing** — champion picks, roles
5. **What everyone built** — items, runes, summoner spells
6. **Match result and score**

## Functional Requirements

### MVP (Phase 1)
- [ ] Input: my Riot ID (summoner name + tagline) + region
- [ ] Input: friend-request sender's Riot ID (summoner name + tagline) + region
- [ ] Tagline must be one of supported Riot servers (NA1, EUW1, KR, BR1, LA1, LA2, OC1, TR1, RU, SG, PH, TH, TW, JP, VN)
- [ ] Region dropdown auto-populates from tagline selection
- [ ] Output: list of shared games (if any), with key details
- [ ] Output: "No shared game history found" if none exists
- [ ] Links out to op.gg/u.gg match URLs for detailed view

### Future (Phase 2+)
- [ ] Track multiple friend request senders over time
- [ ] Show interaction timeline
- [ ] Notifications for new friend requests with context
- [ ] Social graph visualization
- [ ] Support all Riot regions dynamically

## User Stories

1. **As a user**, I want to enter my Riot ID (username + tagline) and region so I can be identified
2. **As a user**, I want to enter a friend-request sender's Riot ID (username + tagline) and region so I can find shared games
3. **As a user**, I want to see the match result so I know if this was a ranked or casual game
4. **As a user**, I want links to the full match on op.gg/u.gg so I can see detailed builds
5. **As a user**, I want to know if someone is likely a bot or random person (no shared history = suspicious)

## Non-Goals
- Tagline is required (e.g., "NA1", "EUW1", "KR") — it's the server identifier from your Riot ID
- Region is required (dropdown) — geographic area auto-populated from tagline
- **Example input:** "Faker" + "NA1" + "North America"
