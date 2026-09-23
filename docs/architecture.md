# Architecture — whodis.gg

## Design Philosophy

Start with the simplest possible architecture that works. Add complexity only when needed.

## MVP Architecture (Static Site)

```
User
  ↓ (inputs 2 usernames + region)
Static HTML Page (hosted on GitHub Pages)
  ↓ (JavaScript fetch)
Riot Games API (via browser)
  ↓ (JSON response)
Static HTML Page (displays results)
  ↓ (links)
op.gg / u.gg (detailed match views)
```

## Key Components

### Frontend
- Plain HTML + JavaScript
- No framework for simplicity
- Handles user input and displays results

### Data Source
- Riot Developer API (personal key)
- Endpoints: account-v1, summoner-v4, match-v5

### Links
- op.gg for detailed match builds
- u.gg for alternative view

## Data Flow

1. User inputs two usernames + region
2. JavaScript resolves usernames to PUUIDs (Riot account-v1)
3. JavaScript fetches match IDs for both players (match-v5 by PUUID)
4. JavaScript finds overlapping match IDs
5. JavaScript fetches match details for shared games
6. Results displayed with links to op.gg/u.gg

## Security Considerations

- API key is exposed in browser (acceptable for personal project)
- For production, use a backend proxy
- Rate limits enforced by Riot API
