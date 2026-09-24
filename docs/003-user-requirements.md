# User Requirements — whodis.gg

## Pain Point

When receiving friend requests in League of Legends, I don't remember which game I played with that person. I have ~15 friend requests and don't know whether they sent the request to flame me or to genuinely be friends. Manually searching each person on op.gg/u.gg and scrolling through hundreds of games is impractical.

## Core Problem Statement

**I want to input my League Riot ID (username + tagline) plus region, AND a friend-request sender's Riot ID (username + tagline) plus region, and have the tool tell me:**

> **Important:** Riot accounts use a "username#tagline" format (e.g., "Faker#NA1"). The tagline is an arbitrary account label (e.g., "NA1", "OC", "XA58") — it is NOT the server code. The region (server) is a separate dropdown selection. Both are required.

**Key insight:** The tagline (e.g., OC, XA58) is part of the Riot ID. The region (e.g., OC1, NA1) is a separate API routing code. The input must capture both independently.

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
- [ ] Region dropdown must include all supported Riot platform codes (NA1, EUW1, KR, BR1, LA1, LA2, OC1, TR1, RU, SG2, PH2, TH2, TW2, VN2, JP1)
- [ ] Region dropdown is independent (separate from tagline; both required)
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

1. **As a user**, I want to enter my Riot ID in "username#tagline" format and select my region (server) so I can be identified
2. **As a user**, I want to enter a friend-request sender's Riot ID in "username#tagline" format and select their region (server) so I can find shared games
3. **As a user**, I want to see the match result so I know if this was a ranked or casual game
4. **As a user**, I want links to the full match on op.gg/u.gg so I can see detailed builds
5. **As a user**, I want to know if someone is likely a bot or random person (no shared history = suspicious)

## Non-Goals
- Tagline is required (e.g., "OC", "XA58", "NA1") — it's the arbitrary account label after # in your Riot ID
- Region is required (dropdown) — the server code for API routing (e.g., OC1, NA1, EUW1); independent of tagline; both must be specified
- **Example input:** Riot ID: "Faker#NA1", Region: "NA1" (North America)
