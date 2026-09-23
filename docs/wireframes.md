# Wireframes — User Workflow

## Flow 1: Find Shared Games

```mermaid
mermaid
flowchart TB
    A[Input Form] --> B{Valid Input?}
    B -->|Yes| C[Load Matches]
    B -->|No| D[Error: Missing fields]
    C --> E[Match List]
    E --> F[Share Result + Details]
    F --> G[Link to op.gg / u.gg]
    G --> H[End]
```

## Flow 2: Input Fields (Text-based)

```mermaid
mermaid
flowchart TD
    A[Username Field] --> B{Enter Riot ID}
    B --> C[Tagline/Server Field]
    C --> D[Region Dropdown]
    D --> E[Submit]
    E --> F[No shared games → "No match found"]
    E --> G[Matches found → Show table]
    
    subgraph "Required"
        B
        C
        D
    end
```

## Key Decisions

1. **Input:** Two Riot IDs (username#tagline) + region
   - Why: Riot API requires full ID (not just username)
   - Tagline = server/region (NA1, EUW1, KR, etc.)

2. **Supported Regions:** All Riot regions (not just the 3 select in frontend)
   - Currently: NA1, EUW1, KR, BR1, LA1, LA2
   - Future: Add all 16+ Riot regions

3. **Output:** List of shared matches with:
   - Match date & time
   - Game mode (Solo Queue, Duo Queue, Ranked, Custom)
   - Winner (Win/Loss/Draw)
   - Champion picks
   - Role assignments
   - Build summary (items, runes, summoner spells)
   - Op.gg / u.gg match URL

4. **Edge Cases:**
   - No shared games → "No match found" (honest, not misleading)
   - Multiple shared games → Paginated list
   - Same player appears multiple times → Group by match ID
```

## Wireframe Notes

- **Minimalist UI** — just the form, loading state, and results
- **No extra fluff** — the user shouldn't need to know about API limits, rate limits, etc.
- **Error handling** — clear messages for missing fields, no shared games, etc.
- **Future expansion** — could add "My Matches" history later

## Files

- `wireframes.md` — this document
- `frontend/index.html` — form UI (already exists)
- `frontend/app.js` — form handler (currently demo mode)
- `config.js` — region enum (currently 3 values, needs to support all regions)
